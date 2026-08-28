import { Request, Response, NextFunction } from "express";
import { CartService } from "../services/cart.service";

function resolveUserId(req: Request): string {
  if (req.user?.userId) return req.user.userId;
  if (req.body?.userId) return req.body.userId;
  if (req.query?.userId) return String(req.query.userId);
  return "demo_buyer_user_1";
}

// ----------------------------------------------------
// 1. GET /cart
// ----------------------------------------------------
export async function getCartHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const cart = await CartService.getCart(userId);

    return res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 2. POST /cart/add
// ----------------------------------------------------
export async function addToCartHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const { listingId, quantity = 1 } = req.body;

    if (!listingId) {
      return res.status(400).json({ success: false, error: "listingId is required" });
    }

    const updatedCart = await CartService.addToCart(userId, listingId, parseInt(String(quantity), 10) || 1);

    return res.status(201).json({
      success: true,
      message: "Item added to cart.",
      data: updatedCart,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, error: error.message });
  }
}

// ----------------------------------------------------
// 3. DELETE /cart/remove/:listingId
// ----------------------------------------------------
export async function removeFromCartHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const { listingId } = req.params;

    const updatedCart = await CartService.removeFromCart(userId, listingId);

    return res.json({
      success: true,
      message: "Item removed from cart.",
      data: updatedCart,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. POST /cart/clear
// ----------------------------------------------------
export async function clearCartHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    await CartService.clearCart(userId);

    return res.json({
      success: true,
      message: "Cart cleared.",
      data: {
        userId,
        items: [],
        itemCount: 0,
        subtotal: 0,
        platformFee: 0,
        warrantyFee: 0,
        total: 0,
        carbonOffsetKg: 0,
      },
    });
  } catch (error) {
    next(error);
  }
}
