import { Router } from "express";
import {
  registerHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  sendOtpHandler,
  verifyOtpHandler,
  googleAuthHandler,
  googleCallbackHandler,
  getMeHandler,
  firebaseAuthHandler,
} from "./auth.controller";
import { authenticateJWT } from "./auth.middleware";

const router = Router();

// Public routes
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/logout", logoutHandler);
router.post("/refresh", refreshHandler);
router.post("/firebase", firebaseAuthHandler);

// OTP routes
router.post("/otp/send", sendOtpHandler);
router.post("/otp/verify", verifyOtpHandler);

// Google OAuth
router.get("/google", googleAuthHandler);
router.get("/google/callback", googleCallbackHandler);

// Protected routes
router.get("/me", authenticateJWT, getMeHandler);

export default router;
