import { getDb, OrderStatus, NotificationType } from "@retech/database";
import { NotificationService } from "./notification.service";
import { v4 as uuidv4 } from "uuid";

export class ReviewService {
  /**
   * Creates a review for a completed order.
   * Enforces:
   * 1. Only buyer of the order can review.
   * 2. Rating must be 1–5.
   * 3. Comment must be at least 20 characters.
   */
  static async createReview(buyerId: string, orderId: string, rating: number, comment: string) {
    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be an integer between 1 and 5.");
    }

    if (!comment || comment.trim().length < 20) {
      throw new Error("Review comment must contain at least 20 characters.");
    }

    const db = await getDb();
    
    const order = await db.get(`SELECT * FROM "Order" WHERE id = ?`, [orderId]);
    if (!order) {
      throw new Error("Order not found.");
    }
    
    if (order.buyerId !== buyerId) {
      throw new Error("Only the verified buyer of this order can leave a review.");
    }

    const existingReview = await db.get(`SELECT * FROM Review WHERE orderId = ?`, [orderId]);
    if (existingReview) {
      throw new Error("A review has already been submitted for this order.");
    }

    const reviewId = uuidv4();
    await db.run(
      `INSERT INTO Review (id, orderId, rating, comment) VALUES (?, ?, ?, ?)`,
      [reviewId, orderId, rating, comment.trim()]
    );

    const review = await db.get(`SELECT * FROM Review WHERE id = ?`, [reviewId]);
    
    const listing = await db.get(`SELECT * FROM DeviceListing WHERE id = ?`, [order.listingId]);
    const buyer = await db.get(`SELECT * FROM User WHERE id = ?`, [order.buyerId]);

    review.order = order;
    review.order.buyer = buyer;
    review.order.listing = listing;

    // Notify Seller about new review
    const sellerId = listing?.sellerId;
    if (sellerId) {
      await NotificationService.sendNotification({
        userId: sellerId,
        type: NotificationType.REVIEW_RECEIVED,
        title: "New Review Received",
        message: `You received a ${rating}-star review on "${listing?.title || "Device"}": "${comment.slice(0, 45)}..."`,
        link: `/listings/${listing.id}`,
      });
    }

    return review;
  }

  /**
   * Retrieves all reviews for a listing/device
   */
  static async getListingReviews(listingId: string) {
    const db = await getDb();
    const reviews = await db.all(`
      SELECT r.*,
        o.id as order_id, o.listingId, o.buyerId, o.amount, o.status as order_status, o.paymentIntentId, o.createdAt as order_createdAt, o.updatedAt as order_updatedAt,
        b.id as buyer_id, b.name as buyer_name, b.avatar as buyer_avatar
      FROM Review r
      JOIN "Order" o ON r.orderId = o.id
      JOIN User b ON o.buyerId = b.id
      WHERE o.listingId = ? AND r.flagged = 0
      ORDER BY r.createdAt DESC
    `, [listingId]);

    const formattedReviews = reviews.map((r: any) => ({
      id: r.id,
      orderId: r.orderId,
      rating: r.rating,
      comment: r.comment,
      sellerReply: r.sellerReply,
      flagged: r.flagged,
      createdAt: r.createdAt,
      order: {
        id: r.order_id,
        listingId: r.listingId,
        buyerId: r.buyerId,
        amount: r.amount,
        status: r.order_status,
        paymentIntentId: r.paymentIntentId,
        createdAt: r.order_createdAt,
        updatedAt: r.order_updatedAt,
        buyer: {
          id: r.buyer_id,
          name: r.buyer_name,
          avatar: r.buyer_avatar,
        }
      }
    }));

    const total = formattedReviews.length;
    const avgRating = total > 0 ? formattedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / total : 5.0;

    return {
      reviews: formattedReviews,
      count: total,
      averageRating: Math.round(avgRating * 10) / 10,
    };
  }

  /**
   * Retrieves all reviews for a seller
   */
  static async getSellerReviews(sellerId: string) {
    const db = await getDb();
    const reviews = await db.all(`
      SELECT r.*,
        o.id as order_id, o.listingId, o.buyerId, o.amount, o.status as order_status, o.paymentIntentId, o.createdAt as order_createdAt, o.updatedAt as order_updatedAt,
        b.id as buyer_id, b.name as buyer_name, b.avatar as buyer_avatar,
        l.id as listing_id, l.title as listing_title
      FROM Review r
      JOIN "Order" o ON r.orderId = o.id
      JOIN User b ON o.buyerId = b.id
      JOIN DeviceListing l ON o.listingId = l.id
      WHERE l.sellerId = ?
      ORDER BY r.createdAt DESC
    `, [sellerId]);

    const formattedReviews = reviews.map((r: any) => ({
      id: r.id,
      orderId: r.orderId,
      rating: r.rating,
      comment: r.comment,
      sellerReply: r.sellerReply,
      flagged: r.flagged,
      createdAt: r.createdAt,
      order: {
        id: r.order_id,
        listingId: r.listingId,
        buyerId: r.buyerId,
        amount: r.amount,
        status: r.order_status,
        paymentIntentId: r.paymentIntentId,
        createdAt: r.order_createdAt,
        updatedAt: r.order_updatedAt,
        buyer: {
          id: r.buyer_id,
          name: r.buyer_name,
          avatar: r.buyer_avatar,
        },
        listing: {
          id: r.listing_id,
          title: r.listing_title,
        }
      }
    }));

    const total = formattedReviews.length;
    const avgRating = total > 0 ? formattedReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / total : 4.9;

    return {
      reviews: formattedReviews,
      count: total,
      averageRating: Math.round(avgRating * 10) / 10,
    };
  }

  /**
   * Seller replies to a review (1 reply per review)
   */
  static async replyToReview(reviewId: string, sellerId: string, replyText: string) {
    if (!replyText || replyText.trim().length === 0) {
      throw new Error("Reply text cannot be empty.");
    }

    const db = await getDb();
    const review = await db.get(`
      SELECT r.*, o.listingId, l.sellerId 
      FROM Review r
      JOIN "Order" o ON r.orderId = o.id
      JOIN DeviceListing l ON o.listingId = l.id
      WHERE r.id = ?
    `, [reviewId]);

    if (!review) {
      throw new Error("Review not found.");
    }

    if (review.sellerId !== sellerId) {
      throw new Error("Only the seller of this listing can submit a reply.");
    }

    await db.run(`UPDATE Review SET sellerReply = ? WHERE id = ?`, [replyText.trim(), reviewId]);
    
    const updated = await db.get(`SELECT * FROM Review WHERE id = ?`, [reviewId]);
    return updated;
  }

  /**
   * Admin flags / unflags review
   */
  static async flagReview(reviewId: string, flagged: boolean) {
    const db = await getDb();
    await db.run(`UPDATE Review SET flagged = ? WHERE id = ?`, [flagged, reviewId]);
    return await db.get(`SELECT * FROM Review WHERE id = ?`, [reviewId]);
  }
}
