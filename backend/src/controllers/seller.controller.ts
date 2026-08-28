import { Request, Response, NextFunction } from "express";
import { SellerService } from "../services/seller.service";

function resolveSellerId(req: Request): string {
  if (req.user?.userId) return req.user.userId;
  if (req.query?.sellerId) return String(req.query.sellerId);
  return "demo_seller_user_1";
}

// ----------------------------------------------------
// 1. GET /seller/dashboard
// ----------------------------------------------------
export async function getSellerDashboardHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = resolveSellerId(req);
    const dashboard = await SellerService.getSellerDashboard(sellerId);

    return res.json({
      success: true,
      data: dashboard,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 2. GET /seller/listings
// ----------------------------------------------------
export async function getSellerListingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = resolveSellerId(req);
    const listings = await SellerService.getSellerListings(sellerId);

    return res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. GET /seller/orders
// ----------------------------------------------------
export async function getSellerOrdersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = resolveSellerId(req);
    const orders = await SellerService.getSellerOrders(sellerId);

    return res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. GET /seller/earnings
// ----------------------------------------------------
export async function getSellerEarningsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = resolveSellerId(req);
    const earnings = await SellerService.getSellerEarnings(sellerId);

    return res.json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 5. GET /seller/profile/:id (Public Profile)
// ----------------------------------------------------
export async function getSellerProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const profile = await SellerService.getPublicSellerProfile(id);

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 6. PATCH /seller/profile
// ----------------------------------------------------
export async function updateSellerProfileHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = resolveSellerId(req);
    const updated = await SellerService.updateSellerProfile(sellerId, req.body);

    return res.json({
      success: true,
      message: "Seller profile updated.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 7. POST /seller/onboarding/complete
// ----------------------------------------------------
export async function completeSellerOnboardingHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId || req.body.userId || "demo_buyer_user_1";
    const result = await SellerService.completeOnboarding(userId, req.body);

    return res.status(201).json({
      success: true,
      message: result.message,
      data: result.profile,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}
