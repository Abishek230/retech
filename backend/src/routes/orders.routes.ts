import { Router } from "express";
import {
  getOrdersHandler,
  getOrderByIdHandler,
  getSellerOrdersHandler,
  updateOrderStatusHandler,
} from "../controllers/orders.controller";
import { optionalAuth } from "../auth";

const router = Router();

router.get("/orders", optionalAuth, getOrdersHandler);
router.get("/orders/seller", optionalAuth, getSellerOrdersHandler);
router.get("/orders/:id", optionalAuth, getOrderByIdHandler);
router.patch("/orders/:id/status", optionalAuth, updateOrderStatusHandler);

export default router;
