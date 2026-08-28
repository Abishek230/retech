import { getDb, WarrantyStatus, NotificationType } from "@retech/database";
import { NotificationService } from "./notification.service";
import { v4 as uuidv4 } from "uuid";

export class WarrantyService {
  /**
   * Creates a certified warranty record for an order
   */
  static async createWarranty(orderId: string, durationMonths = 12, tier = "PREMIUM") {
    const db = await getDb();
    const expiresAt = new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString();
    const terms =
      tier === "PREMIUM"
        ? "12-Month ReTech Certified Comprehensive Hardware, Sensor, Optics & Battery Coverage."
        : "6-Month ReTech Standard Circular Hardware Coverage.";

    const existing = await db.get(`SELECT * FROM Warranty WHERE orderId = ?`, [orderId]);
    if (existing) {
      await db.run(
        `UPDATE Warranty SET duration = ?, tier = ?, status = ?, expiresAt = ?, terms = ? WHERE orderId = ?`,
        [durationMonths, tier, WarrantyStatus.ACTIVE, expiresAt, terms, orderId]
      );
    } else {
      await db.run(
        `INSERT INTO Warranty (id, orderId, duration, tier, status, expiresAt, terms) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [uuidv4(), orderId, durationMonths, tier, WarrantyStatus.ACTIVE, expiresAt, terms]
      );
    }
    return await db.get(`SELECT * FROM Warranty WHERE orderId = ?`, [orderId]);
  }

  /**
   * Retrieves warranty for a specific order
   */
  static async getOrderWarranty(orderId: string) {
    const db = await getDb();
    const warranty = await db.get(`SELECT * FROM Warranty WHERE orderId = ?`, [orderId]);

    if (!warranty) {
      throw new Error("Warranty not found for this order.");
    }
    
    const order = await db.get(`SELECT * FROM "Order" WHERE id = ?`, [warranty.orderId]);
    const listing = await db.get(`SELECT * FROM DeviceListing WHERE id = ?`, [order.listingId]);
    const device = await db.get(`SELECT * FROM Device WHERE id = ?`, [listing.deviceId]);
    const buyer = await db.get(`SELECT * FROM User WHERE id = ?`, [order.buyerId]);

    listing.device = device;
    order.listing = listing;
    order.buyer = buyer;
    warranty.order = order;

    const isExpired = new Date(warranty.expiresAt) < new Date();
    const daysRemaining = Math.max(
      0,
      Math.ceil((new Date(warranty.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    );

    return {
      ...warranty,
      isExpired,
      daysRemaining,
    };
  }

  /**
   * Retrieves all warranties for a user
   */
  static async getUserWarranties(userId: string) {
    const db = await getDb();
    const warranties = await db.all(`
      SELECT w.*, 
        o.id as order_id, o.listingId, o.buyerId, o.amount, o.status as order_status, o.paymentIntentId, o.createdAt as order_createdAt, o.updatedAt as order_updatedAt,
        l.id as listing_id, l.title as listing_title, l.deviceId,
        d.id as device_id, d.brand, d.model, d.year
      FROM Warranty w
      JOIN "Order" o ON w.orderId = o.id
      JOIN DeviceListing l ON o.listingId = l.id
      JOIN Device d ON l.deviceId = d.id
      WHERE o.buyerId = ?
      ORDER BY w.createdAt DESC
    `, [userId]);

    return warranties.map((w: any) => {
      const isExpired = new Date(w.expiresAt) < new Date();
      const daysRemaining = Math.max(
        0,
        Math.ceil((new Date(w.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      );

      return {
        id: w.id,
        orderId: w.orderId,
        duration: w.duration,
        tier: w.tier,
        status: w.status,
        expiresAt: w.expiresAt,
        terms: w.terms,
        claimNotes: w.claimNotes,
        createdAt: w.createdAt,
        updatedAt: w.updatedAt,
        order: {
          id: w.order_id,
          listingId: w.listingId,
          buyerId: w.buyerId,
          amount: w.amount,
          status: w.order_status,
          paymentIntentId: w.paymentIntentId,
          createdAt: w.order_createdAt,
          updatedAt: w.order_updatedAt,
          listing: {
            id: w.listing_id,
            title: w.listing_title,
            deviceId: w.deviceId,
            device: {
              id: w.device_id,
              brand: w.brand,
              model: w.model,
              year: w.year
            }
          }
        },
        isExpired,
        daysRemaining,
      };
    });
  }

  /**
   * Files a warranty claim for replacement, repair, or battery inspection
   */
  static async claimWarranty(params: {
    warrantyId: string;
    userId: string;
    issueDescription: string;
    claimType: "BATTERY_DEGRADATION" | "SENSOR_FAILURE" | "OPTICAL_SCRATCH" | "HARDWARE_DEFECT";
  }) {
    const { warrantyId, userId, issueDescription, claimType } = params;
    const db = await getDb();

    const warranty = await db.get(`
      SELECT w.*, o.buyerId, l.title as listing_title
      FROM Warranty w
      JOIN "Order" o ON w.orderId = o.id
      JOIN DeviceListing l ON o.listingId = l.id
      WHERE w.id = ?
    `, [warrantyId]);

    if (!warranty) {
      throw new Error("Warranty record not found.");
    }

    if (warranty.buyerId !== userId) {
      throw new Error("Only the verified buyer can file a claim for this warranty.");
    }

    if (new Date(warranty.expiresAt) < new Date()) {
      throw new Error("Warranty coverage has expired.");
    }

    const claimNotes = `Claim Type: ${claimType} | Description: ${issueDescription} | Filed: ${new Date().toISOString()}`;

    await db.run(
      `UPDATE Warranty SET status = ?, claimNotes = ? WHERE id = ?`,
      [WarrantyStatus.CLAIMED, claimNotes, warrantyId]
    );
    const updated = await db.get(`SELECT * FROM Warranty WHERE id = ?`, [warrantyId]);

    // Notify user
    await NotificationService.sendNotification({
      userId,
      type: NotificationType.SYSTEM,
      title: "Warranty Claim Filed",
      message: `Your claim for ${warranty.listing_title || "Device"} has been registered. Technician review underway.`,
      link: `/orders/${warranty.orderId}`,
    });

    return updated;
  }
}
