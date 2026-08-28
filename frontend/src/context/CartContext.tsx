"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  listingId: string;
  quantity: number;
  subtotal?: number;
  listing?: any;
}

export interface CartData {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  platformFee: number;
  warrantyFee: number;
  total: number;
  carbonOffsetKg: number;
}

interface CartContextType {
  cart: CartData;
  itemCount: number;
  isLoading: boolean;
  addToCart: (listing: any, quantity?: number) => Promise<boolean>;
  removeFromCart: (listingId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const defaultCart: CartData = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  platformFee: 0,
  warrantyFee: 0,
  total: 0,
  carbonOffsetKg: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const LOCAL_STORAGE_KEY = "retech_local_cart";

function calculateCartTotals(items: CartItem[]): CartData {
  let subtotal = 0;
  let carbon = 0;
  let count = 0;

  for (const item of items) {
    const qty = item.quantity || 1;
    const price = Number(item.listing?.price) || Number(item.subtotal ? item.subtotal / qty : 0) || 0;
    const itemSubtotal = item.subtotal || (price * qty);
    subtotal += itemSubtotal;
    count += qty;
    const itemCo2 = item.listing?.device?.sustainabilityRecords?.[0]?.co2SavedKg || 54.0;
    carbon += itemCo2 * qty;
  }

  const platformFee = Math.round(subtotal * 0.05 * 100) / 100;
  const total = Math.round((subtotal + platformFee) * 100) / 100;

  return {
    items,
    itemCount: count,
    subtotal,
    platformFee,
    warrantyFee: 0,
    total,
    carbonOffsetKg: Math.round(carbon * 10) / 10,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, accessToken } = useAuth();
  const [cart, setCart] = useState<CartData>(defaultCart);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to persist local storage
  const saveLocalCart = (items: CartItem[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
      } catch {}
    }
  };

  // Helper to load local storage
  const loadLocalCart = (): CartItem[] => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Keep items that have valid listingId and valid positive price
            return parsed.filter((i) => i && i.listingId && (i.listing?.price || i.subtotal));
          }
        }
      } catch {}
    }
    return [];
  };

  // Synchronize cart with backend API
  const refreshCart = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(`${API_BASE}/cart`, {
        headers,
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          const apiCart = data.data;
          if (apiCart.items && apiCart.items.length > 0) {
            setCart(apiCart);
            saveLocalCart(apiCart.items);
            return;
          }
        }
      }
    } catch {}

    // Fallback to local storage if API is unreachable or returned empty
    const localItems = loadLocalCart();
    setCart(calculateCartTotals(localItems));
  }, [accessToken]);

  // Initial cart load on mount
  useEffect(() => {
    const localItems = loadLocalCart();
    if (localItems.length > 0) {
      setCart(calculateCartTotals(localItems));
    }
    refreshCart();
  }, [refreshCart]);

  // Add Item to Cart
  const addToCart = async (listing: any, quantity = 1): Promise<boolean> => {
    if (!listing || !listing.id) return false;

    setIsLoading(true);

    const price = Number(listing.price) || 0;
    const itemSubtotal = price * quantity;

    // 1. Optimistically update local cart immediately for zero-latency UI
    const existingIndex = cart.items.findIndex((i) => i.listingId === listing.id);
    let updatedItems: CartItem[] = [];

    if (existingIndex >= 0) {
      updatedItems = cart.items.map((i) =>
        i.listingId === listing.id
          ? {
              ...i,
              quantity: i.quantity + quantity,
              subtotal: (i.quantity + quantity) * price,
              listing: { ...listing, price },
            }
          : i
      );
    } else {
      updatedItems = [
        ...cart.items.filter((i) => i.listingId !== listing.id),
        {
          listingId: listing.id,
          quantity,
          subtotal: itemSubtotal,
          listing: { ...listing, price },
        },
      ];
    }

    const calculated = calculateCartTotals(updatedItems);
    setCart(calculated);
    saveLocalCart(updatedItems);

    // 2. Dispatch to backend API
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          listingId: listing.id,
          quantity,
          userId: user?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.items?.length > 0) {
          setCart(data.data);
          saveLocalCart(data.data.items);
        }
      }
    } catch {}

    setIsLoading(false);
    return true;
  };

  // Remove Item from Cart
  const removeFromCart = async (listingId: string): Promise<boolean> => {
    const updatedItems = cart.items.filter((i) => i.listingId !== listingId);
    setCart(calculateCartTotals(updatedItems));
    saveLocalCart(updatedItems);

    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      await fetch(`${API_BASE}/cart/remove/${listingId}`, {
        method: "DELETE",
        headers,
        credentials: "include",
      });
    } catch {}

    return true;
  };

  // Clear Cart
  const clearCart = async (): Promise<boolean> => {
    setCart(defaultCart);
    saveLocalCart([]);

    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      await fetch(`${API_BASE}/cart/clear`, {
        method: "POST",
        headers,
        credentials: "include",
      });
    } catch {}

    return true;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount: cart.itemCount,
        isLoading,
        addToCart,
        removeFromCart,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
