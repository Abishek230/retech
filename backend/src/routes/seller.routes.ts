import { Router } from "express";
import {
  getSellerDashboardHandler,
  getSellerListingsHandler,
  getSellerOrdersHandler,
  getSellerEarningsHandler,
  getSellerProfileHandler,
  updateSellerProfileHandler,
  completeSellerOnboardingHandler,
} from "../controllers/seller.controller";
import { optionalAuth } from "../auth";

const router = Router();

router.get("/seller/dashboard", optionalAuth, getSellerDashboardHandler);
router.get("/seller/listings", optionalAuth, getSellerListingsHandler);
router.get("/seller/orders", optionalAuth, getSellerOrdersHandler);
router.get("/seller/earnings", optionalAuth, getSellerEarningsHandler);
router.get("/seller/profile/:id", getSellerProfileHandler);
router.patch("/seller/profile", optionalAuth, updateSellerProfileHandler);
router.post("/seller/onboarding/complete", optionalAuth, completeSellerOnboardingHandler);

export default router;
