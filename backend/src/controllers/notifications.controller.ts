import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service";
import { NotificationType } from "@retech/database";

function resolveUserId(req: Request): string {
  if (req.user?.userId) return req.user.userId;
  if (req.params.userId) return req.params.userId;
  if (req.body?.userId) return req.body.userId;
  return "demo_buyer_user_1";
}

// ----------------------------------------------------
// 1. POST /notifications/send
// ----------------------------------------------------
export async function sendNotificationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId, type, title, message, link, sendEmail, userEmail } = req.body;

    if (!userId || !type || !message) {
      return res.status(400).json({ success: false, error: "userId, type, and message are required." });
    }

    const notification = await NotificationService.sendNotification({
      userId,
      type: type as NotificationType,
      title: title || "ReTech Notification",
      message,
      link,
      sendEmail,
      userEmail,
    });

    return res.status(201).json({
      success: true,
      message: "Notification dispatched.",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 2. GET /notifications/:userId
// ----------------------------------------------------
export async function getUserNotificationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const result = await NotificationService.getUserNotifications(userId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. PATCH /notifications/:id/read
// ----------------------------------------------------
export async function markNotificationReadHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const { id } = req.params;

    await NotificationService.markAsRead(id, userId);

    return res.json({
      success: true,
      message: "Notification marked as read.",
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. DELETE /notifications/clear
// ----------------------------------------------------
export async function clearNotificationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    await NotificationService.clearUserNotifications(userId);

    return res.json({
      success: true,
      message: "All notifications cleared.",
    });
  } catch (error) {
    next(error);
  }
}
