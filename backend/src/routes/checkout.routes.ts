import { Router } from "express";
import {
  createPaymentIntentHandler,
  confirmCheckoutHandler,
  stripeWebhookHandler,
} from "../controllers/checkout.controller";
import { optionalAuth } from "../auth";

const router = Router();

router.post("/checkout/intent", optionalAuth, createPaymentIntentHandler);
router.post("/checkout/confirm", optionalAuth, confirmCheckoutHandler);
router.post("/checkout/webhook", stripeWebhookHandler);

export default router;
