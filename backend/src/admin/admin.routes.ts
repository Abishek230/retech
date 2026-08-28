import { Router } from "express";
import {
  getAdminMetricsHandler,
  getUsersListHandler,
  promoteUserHandler,
  suspendUserHandler,
  deleteUserHandler,
  getAdminListingsHandler,
  updateListingStatusHandler,
  getPassportEntriesHandler,
  verifyPassportEntryHandler,
  bulkVerifyPassportEntriesHandler,
  getDisputesHandler,
  resolveDisputeHandler,
  getPlatformAnalyticsHandler,
  getSystemHealthHandler,
  getAuditLogsHandler,
} from "./admin.controller";
import { optionalAuth } from "../auth";

const router = Router();

// Metrics & Dashboard
router.get("/admin/metrics", optionalAuth, getAdminMetricsHandler);

// Users
router.get("/admin/users", optionalAuth, getUsersListHandler);
router.patch("/admin/users/:id/role", optionalAuth, promoteUserHandler);
router.patch("/admin/users/:id/status", optionalAuth, suspendUserHandler);
router.delete("/admin/users/:id", optionalAuth, deleteUserHandler);

// Listings Moderation
router.get("/admin/listings", optionalAuth, getAdminListingsHandler);
router.patch("/admin/listings/:id/status", optionalAuth, updateListingStatusHandler);

// Passport Verification
router.get("/admin/passport", optionalAuth, getPassportEntriesHandler);
router.post("/admin/passport/verify", optionalAuth, verifyPassportEntryHandler);
router.post("/admin/passport/bulk-verify", optionalAuth, bulkVerifyPassportEntriesHandler);

// Disputes
router.get("/admin/disputes", optionalAuth, getDisputesHandler);
router.post("/admin/disputes/:id/resolve", optionalAuth, resolveDisputeHandler);

// Analytics & System Health
router.get("/admin/analytics", optionalAuth, getPlatformAnalyticsHandler);
router.get("/admin/system", optionalAuth, getSystemHealthHandler);

// Audit Logs
router.get("/admin/audit-log", optionalAuth, getAuditLogsHandler);

export default router;
