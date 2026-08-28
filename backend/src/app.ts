import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./config/env";
import healthRouter from "./routes/health.routes";
import docsRouter from "./routes/docs.routes";
import listingsRouter from "./routes/listings.routes";
import passportRouter from "./routes/passport.routes";
import agentRouter from "./routes/agent.routes";
import cartRouter from "./routes/cart.routes";
import checkoutRouter from "./routes/checkout.routes";
import ordersRouter from "./routes/orders.routes";
import sustainabilityRouter from "./routes/sustainability.routes";
import notificationsRouter from "./routes/notifications.routes";
import reviewsRouter from "./routes/reviews.routes";
import warrantyRouter from "./routes/warranty.routes";
import sellerRouter from "./routes/seller.routes";
import adminRouter from "./admin/admin.routes";
import { authRouter } from "./auth";
import { rateLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp(): Express {
  const app = express();

  // Security and utilities
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: [env.FRONTEND_URL, "http://localhost:3000"],
      credentials: true,
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(morgan("dev"));

  // Apply rate limiter on public routes (100 req/min/IP)
  app.use(rateLimiter);

  // Serve static optimized uploads
  const uploadsDir = path.resolve(__dirname, "../public/uploads");
  app.use("/uploads", express.static(uploadsDir));

  // Routes
  // 1. Health check & Interactive Docs
  app.use(healthRouter);
  app.use("/api", healthRouter);

  app.use(docsRouter);
  app.use("/api", docsRouter);

  // 2. Authentication
  app.use("/auth", authRouter);
  app.use("/api/auth", authRouter);

  // 3. Marketplace routes
  app.use(listingsRouter);
  app.use("/api", listingsRouter);

  // 4. Digital Life Passport
  app.use(passportRouter);
  app.use("/api", passportRouter);

  // 5. Agentic AI Decision Agent
  app.use(agentRouter);
  app.use("/api", agentRouter);

  // 6. Commerce: Cart, Checkout & Orders
  app.use(cartRouter);
  app.use("/api", cartRouter);

  app.use(checkoutRouter);
  app.use("/api", checkoutRouter);

  app.use(ordersRouter);
  app.use("/api", ordersRouter);

  // 7. Sustainability & Impact Subsystem
  app.use(sustainabilityRouter);
  app.use("/api", sustainabilityRouter);

  // 8. Notifications, Reviews & Warranty Subsystems
  app.use(notificationsRouter);
  app.use("/api", notificationsRouter);

  app.use(reviewsRouter);
  app.use("/api", reviewsRouter);

  app.use(warrantyRouter);
  app.use("/api", warrantyRouter);

  // 9. Seller Dashboard & Onboarding
  app.use(sellerRouter);
  app.use("/api", sellerRouter);

  // 10. Complete Admin Dashboard & Moderation
  app.use(adminRouter);
  app.use("/api", adminRouter);

  // Fallback 404
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      error: `Route not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
