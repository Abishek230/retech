import { Request, Response, NextFunction } from "express";
import { WarrantyService } from "../services/warranty.service";

function resolveUserId(req: Request): string {
  if (req.user?.userId) return req.user.userId;
  if (req.params?.userId) return req.params.userId;
  if (req.body?.userId) return req.body.userId;
  return "demo_buyer_user_1";
}

// ----------------------------------------------------
// 1. GET /warranty/:orderId
// ----------------------------------------------------
export async function getOrderWarrantyHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.params;
    const result = await WarrantyService.getOrderWarranty(orderId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(404).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 2. GET /warranty/user/:userId
// ----------------------------------------------------
export async function getUserWarrantiesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const result = await WarrantyService.getUserWarranties(userId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. POST /warranty/claim
// ----------------------------------------------------
export async function claimWarrantyHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const { warrantyId, issueDescription, claimType } = req.body;

    if (!warrantyId || !issueDescription) {
      return res.status(400).json({
        success: false,
        error: "warrantyId and issueDescription are required.",
      });
    }

    const updated = await WarrantyService.claimWarranty({
      warrantyId,
      userId,
      issueDescription,
      claimType: claimType || "HARDWARE_DEFECT",
    });

    return res.json({
      success: true,
      message: "Warranty claim filed successfully. Technician review initiated.",
      data: updated,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
