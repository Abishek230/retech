import { Router } from "express";
import {
  createPassportHandler,
  addEntryHandler,
  getPassportByDeviceIdHandler,
  getPassportQrHandler,
  getPassportPdfHandler,
  verifyPassportHandler,
} from "../controllers/passport.controller";
import { optionalAuth } from "../auth";

const router = Router();

// Create & Manage
router.post("/passport/create", optionalAuth, createPassportHandler);
router.post("/passport/:id/entry", optionalAuth, addEntryHandler);
router.post("/passport/:id/verify", optionalAuth, verifyPassportHandler);

// Public View & Export
router.get("/passport/:deviceId", getPassportByDeviceIdHandler);
router.get("/passport/:id/qr", getPassportQrHandler);
router.get("/passport/:id/pdf", getPassportPdfHandler);

export default router;
