import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";

function resolveUserId(req: Request): string {
  if (req.user?.userId) return req.user.userId;
  if (req.body?.userId) return req.body.userId;
  return "demo_buyer_user_1";
}

// ----------------------------------------------------
// 1. POST /reviews (Create Verified Review)
// ----------------------------------------------------
export async function createReviewHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const buyerId = resolveUserId(req);
    const { orderId, rating, comment } = req.body;

    if (!orderId || rating === undefined || !comment) {
      return res.status(400).json({
        success: false,
        error: "orderId, rating (1-5), and comment (min 20 chars) are required.",
      });
    }

    const review = await ReviewService.createReview(
      buyerId,
      orderId,
      parseInt(String(rating), 10),
      comment
    );

    return res.status(201).json({
      success: true,
      message: "Verified review submitted successfully.",
      data: review,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 2. GET /reviews/listing/:listingId
// ----------------------------------------------------
export async function getListingReviewsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { listingId } = req.params;
    const result = await ReviewService.getListingReviews(listingId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. GET /reviews/seller/:sellerId
// ----------------------------------------------------
export async function getSellerReviewsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { sellerId } = req.params;
    const result = await ReviewService.getSellerReviews(sellerId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. POST /reviews/:id/reply (Seller Reply)
// ----------------------------------------------------
export async function replyToReviewHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = resolveUserId(req);
    const { id } = req.params;
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ success: false, error: "replyText is required." });
    }

    const updated = await ReviewService.replyToReview(id, sellerId, replyText);

    return res.json({
      success: true,
      message: "Seller reply published.",
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 5. PATCH /reviews/:id/flag (Admin Moderation)
// ----------------------------------------------------
export async function flagReviewHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { flagged = true } = req.body;

    const updated = await ReviewService.flagReview(id, Boolean(flagged));

    return res.json({
      success: true,
      message: `Review ${flagged ? "flagged for review" : "unflagged"}.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}
