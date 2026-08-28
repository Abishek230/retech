import { Router } from "express";
import {
  getCartHandler,
  addToCartHandler,
  removeFromCartHandler,
  clearCartHandler,
} from "../controllers/cart.controller";
import { optionalAuth } from "../auth";

const router = Router();

router.get("/cart", optionalAuth, getCartHandler);
router.post("/cart/add", optionalAuth, addToCartHandler);
router.delete("/cart/remove/:listingId", optionalAuth, removeFromCartHandler);
router.post("/cart/clear", optionalAuth, clearCartHandler);

export default router;
