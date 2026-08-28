import { Router } from "express";
import { getHealthHandler } from "../controllers/health.controller";

const router = Router();

// GET /health
router.get("/health", getHealthHandler);

export default router;
