import { Router } from "express";
import {
  getOrderWarrantyHandler,
  getUserWarrantiesHandler,
  claimWarrantyHandler,
} from "../controllers/warranty.controller";
import { optionalAuth } from "../auth";

const router = Router();

router.get("/warranty/user/:userId", optionalAuth, getUserWarrantiesHandler);
router.get("/warranty/:orderId", optionalAuth, getOrderWarrantyHandler);
router.post("/warranty/claim", optionalAuth, claimWarrantyHandler);

export default router;
