import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchApi } from "../services/api";
import { useAuth } from "./AuthContext";

export interface MobileCartItem {
  id: string;
  listingId: string;
  quantity: number;
  title: string;
  price: number;
  image: string;
}

interface CartContextType {
  items: MobileCartItem[];
  itemCount: number;
  total: number;
  addToCart: (listing: any) => Promise<void>;
  removeFromCart: (listingId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  total: 0,
  addToCart: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<MobileCartItem[]>([
    {
      id: "item_1",
      listingId: "listing_iphone_15",
      quantity: 1,
      title: "iPhone 15 Pro 128GB - Natural Titanium",
      price: 849,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    },
  ]);

  const addToCart = async (listing: any) => {
    const newItem: MobileCartItem = {
      id: `cart_${Date.now()}`,
      listingId: listing.id,
      quantity: 1,
      title: listing.title,
      price: listing.price,
      image: listing.image || listing.images?.[0] || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    };
    setItems((prev) => [...prev.filter((i) => i.listingId !== listing.id), newItem]);
  };

  const removeFromCart = async (listingId: string) => {
    setItems((prev) => prev.filter((i) => i.listingId !== listingId));
  };

  const clearCart = async () => {
    setItems([]);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
