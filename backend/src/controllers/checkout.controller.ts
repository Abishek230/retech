import { Request, Response, NextFunction } from "express";
import { CheckoutService, stripe } from "../services/stripe.service";

function resolveUserId(req: Request): string {
  if (req.user?.userId) return req.user.userId;
  if (req.body?.userId) return req.body.userId;
  return "demo_buyer_user_1";
}

// ----------------------------------------------------
// 1. POST /checkout/intent
// ----------------------------------------------------
export async function createPaymentIntentHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const { items } = req.body || {};
    const intentData = await CheckoutService.createPaymentIntent(userId, items);

    return res.status(201).json({
      success: true,
      message: "Stripe PaymentIntent generated.",
      data: intentData,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 2. POST /checkout/confirm
// ----------------------------------------------------
export async function confirmCheckoutHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const { paymentIntentId, shippingAddress, items } = req.body;

    const result = await CheckoutService.confirmOrder(
      userId,
      paymentIntentId || `pi_manual_${Date.now()}`,
      shippingAddress,
      items
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully, listing marked as SOLD, seller payout scheduled.",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 3. POST /checkout/webhook
// ----------------------------------------------------
export async function stripeWebhookHandler(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: any = req.body;

  if (endpointSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`⚠️ Webhook signature verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  // Handle Event types
  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("⚡ [Stripe Webhook] PaymentIntent succeeded:", event.data.object.id);
      break;
    case "payment_intent.payment_failed":
      console.log("❌ [Stripe Webhook] PaymentIntent failed:", event.data.object.id);
      break;
    case "transfer.created":
      console.log("💰 [Stripe Webhook] Seller transfer created:", event.data.object.id);
      break;
    default:
      console.log(`[Stripe Webhook] Unhandled event: ${event.type}`);
  }

  return res.json({ received: true });
}
