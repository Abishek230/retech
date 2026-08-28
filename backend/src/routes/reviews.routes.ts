import { Router } from "express";
import {
  createReviewHandler,
  getListingReviewsHandler,
  getSellerReviewsHandler,
  replyToReviewHandler,
  flagReviewHandler,
} from "../controllers/reviews.controller";
import { optionalAuth } from "../auth";

const router = Router();

router.post("/reviews", optionalAuth, createReviewHandler);
router.get("/reviews/listing/:listingId", getListingReviewsHandler);
router.get("/reviews/seller/:sellerId", getSellerReviewsHandler);
router.post("/reviews/:id/reply", optionalAuth, replyToReviewHandler);
router.patch("/reviews/:id/flag", optionalAuth, flagReviewHandler);

export default router;
