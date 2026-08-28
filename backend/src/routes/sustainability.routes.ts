import { Router } from "express";
import {
  calculateOrderImpactHandler,
  getUserSustainabilityHandler,
  getPlatformSustainabilityHandler,
  getSustainabilityLeaderboardHandler,
  recalculateAllSustainabilityHandler,
} from "../controllers/sustainability.controller";
import { optionalAuth } from "../auth";

const router = Router();

router.post("/sustainability/calculate/:orderId", optionalAuth, calculateOrderImpactHandler);
router.get("/sustainability/user/:userId", optionalAuth, getUserSustainabilityHandler);
router.get("/sustainability/platform", getPlatformSustainabilityHandler);
router.get("/sustainability/leaderboard", getSustainabilityLeaderboardHandler);
router.post("/sustainability/recalculate", optionalAuth, recalculateAllSustainabilityHandler);

export default router;
