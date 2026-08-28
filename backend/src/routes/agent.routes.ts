import { Router } from "express";
import {
  analyzeDeviceHandler,
  getLatestDecisionHandler,
  getUserDecisionHistoryHandler,
} from "../controllers/agent.controller";
import { optionalAuth } from "../auth";

const router = Router();

router.post("/agent/analyze/:deviceId", optionalAuth, analyzeDeviceHandler);
router.get("/agent/decision/:deviceId", getLatestDecisionHandler);
router.get("/agent/history/:userId", optionalAuth, getUserDecisionHistoryHandler);

export default router;
