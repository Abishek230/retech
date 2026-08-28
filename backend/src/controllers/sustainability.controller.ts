import { Request, Response, NextFunction } from "express";
import { SustainabilityService } from "../services/sustainability.service";

function resolveUserId(req: Request): string {
  if (req.user?.userId) return req.user.userId;
  if (req.params.userId) return req.params.userId;
  return "demo_buyer_user_1";
}

// ----------------------------------------------------
// 1. POST /sustainability/calculate/:orderId
// ----------------------------------------------------
export async function calculateOrderImpactHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderId } = req.params;
    const result = await SustainabilityService.calculateOrderImpact(orderId);

    return res.status(201).json({
      success: true,
      message: "Sustainability impact calculated and recorded.",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 2. GET /sustainability/user/:userId
// ----------------------------------------------------
export async function getUserSustainabilityHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const result = await SustainabilityService.getUserSustainability(userId);

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. GET /sustainability/platform
// ----------------------------------------------------
export async function getPlatformSustainabilityHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await SustainabilityService.getPlatformSustainability();

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. GET /sustainability/leaderboard
// ----------------------------------------------------
export async function getSustainabilityLeaderboardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const platform = await SustainabilityService.getPlatformSustainability();

    return res.json({
      success: true,
      data: platform.leaderboard,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 5. POST /sustainability/recalculate
// ----------------------------------------------------
export async function recalculateAllSustainabilityHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await SustainabilityService.recalculateAll();

    return res.json({
      success: true,
      message: `Successfully recalculated sustainability metrics for ${result.updatedCount} devices.`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
