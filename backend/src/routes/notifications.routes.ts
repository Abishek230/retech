import { Router } from "express";
import {
  sendNotificationHandler,
  getUserNotificationsHandler,
  markNotificationReadHandler,
  clearNotificationsHandler,
} from "../controllers/notifications.controller";
import { optionalAuth } from "../auth";

const router = Router();

router.post("/notifications/send", optionalAuth, sendNotificationHandler);
router.get("/notifications/:userId", optionalAuth, getUserNotificationsHandler);
router.patch("/notifications/:id/read", optionalAuth, markNotificationReadHandler);
router.delete("/notifications/clear", optionalAuth, clearNotificationsHandler);

export default router;
