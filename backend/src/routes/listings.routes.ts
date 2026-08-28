import { Router } from "express";
import multer from "multer";
import {
  createListingHandler,
  uploadImagesHandler,
  updateListingHandler,
  deleteListingHandler,
  getSellerListingsHandler,
  getListingsHandler,
  searchListingsHandler,
  filterListingsHandler,
  getFeaturedListingsHandler,
  getListingByIdHandler,
} from "../controllers/listings.controller";
import { authenticateJWT, optionalAuth } from "../auth";

const router = Router();

// Multer memory storage for direct Sharp stream processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max upload per file
    files: 8, // Max 8 images per upload
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  },
});

// ----------------------------------------------------
// BUYER FLOW ROUTES
// ----------------------------------------------------
router.get("/listings", getListingsHandler);
router.get("/listings/search", searchListingsHandler);
router.get("/listings/filter", filterListingsHandler);
router.get("/listings/featured", getFeaturedListingsHandler);
router.get("/listings/seller/:sellerId", getSellerListingsHandler);
router.get("/listings/:id", getListingByIdHandler);

// ----------------------------------------------------
// SELLER FLOW ROUTES
// ----------------------------------------------------
router.post("/listings", optionalAuth, createListingHandler);
router.post("/listings/upload-images", upload.array("images", 8), uploadImagesHandler);
router.patch("/listings/:id", optionalAuth, updateListingHandler);
router.delete("/listings/:id", optionalAuth, deleteListingHandler);

export default router;
