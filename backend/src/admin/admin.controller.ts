import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import { Role, ListingStatus } from "@retech/database";

function resolveAdminId(req: Request): string {
  if (req.user?.userId) return req.user.userId;
  return "admin_master_1";
}

// ----------------------------------------------------
// 1. GET /admin/metrics (Overview)
// ----------------------------------------------------
export async function getAdminMetricsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await AdminService.getAdminOverview();
    return res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 2. User Management Handlers
// ----------------------------------------------------
export async function getUsersListHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await AdminService.getUsersList();
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
}

export async function promoteUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = resolveAdminId(req);
    const { id } = req.params;
    const { role } = req.body;

    const updated = await AdminService.promoteUser(id, role as Role, adminId);
    return res.json({ success: true, message: `User role updated to ${role}`, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function suspendUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = resolveAdminId(req);
    const { id } = req.params;
    const { suspended = true } = req.body;

    const updated = await AdminService.suspendUser(id, Boolean(suspended), adminId);
    return res.json({ success: true, message: `User suspension status updated`, data: updated });
  } catch (error) {
    next(error);
  }
}

export async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = resolveAdminId(req);
    const { id } = req.params;

    const deleted = await AdminService.deleteUser(id, adminId);
    return res.json({ success: true, message: "User permanently removed", data: deleted });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. Listings Moderation Handlers
// ----------------------------------------------------
export async function getAdminListingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const listings = await AdminService.getListings();
    return res.json({ success: true, count: listings.length, data: listings });
  } catch (error) {
    next(error);
  }
}

export async function updateListingStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = resolveAdminId(req);
    const { id } = req.params;
    const { status } = req.body;

    const updated = await AdminService.updateListingStatus(id, status as ListingStatus, adminId);
    return res.json({ success: true, message: `Listing status updated to ${status}`, data: updated });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. Passport Moderation Handlers
// ----------------------------------------------------
export async function getPassportEntriesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const entries = await AdminService.getPassportEntries();
    return res.json({ success: true, count: entries.length, data: entries });
  } catch (error) {
    next(error);
  }
}

export async function verifyPassportEntryHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = resolveAdminId(req);
    const { id } = req.body;

    const verified = await AdminService.verifyPassportEntry(id, adminId);
    return res.json({ success: true, message: "Passport entry certified", data: verified });
  } catch (error) {
    next(error);
  }
}

export async function bulkVerifyPassportEntriesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = resolveAdminId(req);
    const { entryIds } = req.body;

    const result = await AdminService.bulkVerifyPassportEntries(entryIds || [], adminId);
    return res.json({ success: true, message: `Bulk certified ${result.count} entries`, data: result });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 5. Dispute Resolution Handlers
// ----------------------------------------------------
export async function getDisputesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const disputes = await AdminService.getDisputes();
    return res.json({ success: true, count: disputes.length, data: disputes });
  } catch (error) {
    next(error);
  }
}

export async function resolveDisputeHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const adminId = resolveAdminId(req);
    const { id } = req.params;
    const { action, refundAmount, resolutionNote } = req.body;

    const result = await AdminService.resolveDispute({
      disputeId: id,
      action,
      refundAmount,
      resolutionNote,
      adminId,
    });

    return res.json({ success: true, message: "Dispute resolved", data: result });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 6. Analytics & System Health Handlers
// ----------------------------------------------------
export async function getPlatformAnalyticsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const analytics = await AdminService.getPlatformAnalytics();
    return res.json({ success: true, data: analytics });
  } catch (error) {
    next(error);
  }
}

export async function getSystemHealthHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const health = await AdminService.getSystemHealth();
    return res.json({ success: true, data: health });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 7. Audit Log Handler
// ----------------------------------------------------
export async function getAuditLogsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await AdminService.getAuditLogs();
    return res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
}
