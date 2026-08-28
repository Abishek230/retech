import { getDb, NotificationType } from "@retech/database";
import { getIO } from "../socket";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  auth: {
    user: process.env.SMTP_USER || "retech.notifications@retech.eco",
    pass: process.env.SMTP_PASS || "retech_secret_pass_2026",
  },
});

export class NotificationService {
  /**
   * Dispatches a notification across In-App (Socket.io) and Email (Nodemailer)
   */
  static async sendNotification(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    sendEmail?: boolean;
    userEmail?: string;
  }) {
    const { userId, type, title, message, link, sendEmail = true, userEmail } = params;

    const db = await getDb();
    
    // 1. Persist to PostgreSQL (Now SQLite)
    const notificationId = uuidv4();
    await db.run(
      `INSERT INTO Notification (id, userId, type, title, message, link, read) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [notificationId, userId, type, title, message, link || null, false]
    );

    const notification = await db.get(`SELECT * FROM Notification WHERE id = ?`, [notificationId]);

    // 2. Real-time In-App Push via Socket.io
    try {
      const io = getIO();
      if (io) {
        io.emit(`notification:new:${userId}`, notification);
        io.emit("notification:broadcast", { userId, notification });
        console.log(`⚡ [Socket Notification] Emitted to user ${userId}: ${type}`);
      }
    } catch (err: any) {
      console.warn("⚠️ [Socket Notification] Broadcast skipped:", err.message);
    }

    // 3. Optional Email Dispatch
    if (sendEmail && userEmail) {
      try {
        await emailTransporter.sendMail({
          from: '"ReTech Circular Notifications" <notifications@retech.eco>',
          to: userEmail,
          subject: `[ReTech] ${title}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F8F3EA; padding: 24px; border-radius: 16px;">
              <div style="background-color: #641F2A; padding: 16px; border-radius: 12px; text-align: center; color: #FFFFFF;">
                <h2 style="margin: 0; font-size: 20px;">ReTech Circular Intelligence</h2>
              </div>
              <div style="background-color: #FFFFFF; padding: 24px; margin-top: 16px; border-radius: 12px; border: 1px solid #E5DDD0;">
                <h3 style="color: #641F2A; margin-top: 0;">${title}</h3>
                <p style="color: #4A3528; font-size: 14px; line-height: 1.6;">${message}</p>
                ${
                  link
                    ? `<div style="margin-top: 20px; text-align: center;">
                        <a href="http://localhost:3000${link}" style="background-color: #8A6652; color: #FFFFFF; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">View Details →</a>
                      </div>`
                    : ""
                }
              </div>
              <p style="text-align: center; font-size: 11px; color: #8A6652; margin-top: 16px;">
                ReTech Inc. • AI-Powered Circular Electronics Marketplace
              </p>
            </div>
          `,
        });
      } catch (err: any) {
        console.warn("⚠️ [Email Notification] Send failed:", err.message);
      }
    }

    return notification;
  }

  // ----------------------------------------------------
  // AUTOMATION 1: Order Confirmation (ORDER_PLACED)
  // ----------------------------------------------------
  static async notifyOrderPlaced(order: any, buyer: any) {
    return await this.sendNotification({
      userId: buyer.id,
      userEmail: buyer.email,
      type: NotificationType.ORDER_PLACED,
      title: "Order Placed Successfully",
      message: `Your order #${order.id.slice(0, 8)} for ${order.listing?.title || "Device"} has been confirmed in escrow.`,
      link: `/orders/${order.id}`,
    });
  }

  // ----------------------------------------------------
  // AUTOMATION 2: Shipping Update (ORDER_SHIPPED)
  // ----------------------------------------------------
  static async notifyOrderShipped(order: any, trackingNumber: string, buyer: any) {
    return await this.sendNotification({
      userId: buyer.id,
      userEmail: buyer.email,
      type: NotificationType.ORDER_SHIPPED,
      title: "Your Order is in Transit",
      message: `Order #${order.id.slice(0, 8)} has been dispatched via FedEx (${trackingNumber}).`,
      link: `/orders/${order.id}`,
    });
  }

  // ----------------------------------------------------
  // AUTOMATION 3: Delivery Confirmation (ORDER_DELIVERED)
  // ----------------------------------------------------
  static async notifyOrderDelivered(order: any, buyer: any) {
    return await this.sendNotification({
      userId: buyer.id,
      userEmail: buyer.email,
      type: NotificationType.ORDER_DELIVERED,
      title: "Package Delivered & Verified",
      message: `Your device ${order.listing?.title || ""} has been delivered. 12-Month ReTech Warranty is now active.`,
      link: `/orders/${order.id}`,
    });
  }

  // ----------------------------------------------------
  // AUTOMATION 4: Price Drop Alert (PRICE_DROP)
  // ----------------------------------------------------
  static async notifyPriceDrop(listing: any, oldPrice: number, newPrice: number, user: any) {
    return await this.sendNotification({
      userId: user.id,
      userEmail: user.email,
      type: NotificationType.PRICE_DROP,
      title: `Price Drop Alert: ${listing.title}`,
      message: `Price dropped from $${oldPrice} to $${newPrice}! Save $${oldPrice - newPrice} today.`,
      link: `/listings/${listing.id}`,
    });
  }

  // ----------------------------------------------------
  // AUTOMATION 5: Warranty Expiry Alert (WARRANTY_EXPIRING)
  // ----------------------------------------------------
  static async notifyWarrantyExpiring(warranty: any, user: any) {
    return await this.sendNotification({
      userId: user.id,
      userEmail: user.email,
      type: NotificationType.WARRANTY_EXPIRING,
      title: "Warranty Expiring Soon",
      message: `Your certified ReTech warranty for order #${warranty.orderId.slice(0, 8)} expires in 14 days.`,
      link: `/orders/${warranty.orderId}`,
    });
  }

  static async getUserNotifications(userId: string) {
    const db = await getDb();
    const notifications = await db.all(`SELECT * FROM Notification WHERE userId = ? ORDER BY createdAt DESC LIMIT 30`, [userId]);

    const { count: unreadCount } = await db.get(`SELECT COUNT(*) as count FROM Notification WHERE userId = ? AND read = ?`, [userId, false]) as any;

    return {
      notifications,
      unreadCount,
    };
  }

  static async markAsRead(notificationId: string, userId: string) {
    const db = await getDb();
    await db.run(`UPDATE Notification SET read = ? WHERE id = ? AND userId = ?`, [true, notificationId, userId]);
    return { success: true };
  }

  static async clearUserNotifications(userId: string) {
    const db = await getDb();
    await db.run(`UPDATE Notification SET read = ? WHERE userId = ?`, [true, userId]);
    return { success: true };
  }
}
