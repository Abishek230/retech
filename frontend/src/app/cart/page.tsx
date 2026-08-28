"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, getDeviceImageUrl } from "@/lib/utils";
import {
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Leaf,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Loader2,
  Package,
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, removeFromCart, clearCart, isLoading } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRemove = async (listingId: string) => {
    setIsUpdating(true);
    await removeFromCart(listingId);
    setIsUpdating(false);
  };

  const handleClear = async () => {
    setIsUpdating(true);
    await clearCart();
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-sm font-semibold text-brown-700">Loading Redis Cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Top Banner */}
      <div className="border-b border-cream-200 bg-white/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="burgundy" dot>
                Redis 24h Cart Session
              </Badge>
              <span className="text-xs text-brown-600 font-semibold">
                Auto-saved & Verified Active
              </span>
            </div>
            <h1 className="text-3xl font-black text-brown-950 font-display">
              Your Circular Shopping Cart
            </h1>
          </div>

          <Link href="/marketplace">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />}>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {cart.items.length === 0 ? (
          <div className="rounded-3xl border border-cream-300 bg-white p-12 text-center shadow-warm max-w-md mx-auto space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-100 text-brown-600">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-brown-950 font-display">Your cart is empty</h3>
            <p className="text-xs text-brown-600 leading-relaxed">
              Explore certified refurbished devices with 12-month warranties and AI Second-Life scores.
            </p>
            <Link href="/marketplace" className="inline-block pt-2">
              <Button variant="primary" size="md">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left 8 Cols: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between bg-white rounded-2xl border border-cream-300 p-4 shadow-sm text-xs">
                <span className="font-bold text-brown-900">
                  {cart.itemCount} Item{cart.itemCount > 1 ? "s" : ""} in Cart
                </span>
                <button
                  onClick={handleClear}
                  disabled={isUpdating}
                  className="font-semibold text-burgundy hover:underline flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear Cart
                </button>
              </div>

              {cart.items.map((item) => {
                const listing = item.listing;
                const device = listing?.device;
                const firstImage = getDeviceImageUrl(listing?.images);

                return (
                  <Card
                    key={item.listingId}
                    className="border-cream-300 bg-white p-4 sm:p-5 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Image + Title */}
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden border border-cream-200 bg-cream-50">
                          <Image
                            src={firstImage}
                            alt={listing?.title || "Device"}
                            fill
                            className="object-contain p-1"
                          />
                        </div>

                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-brown-500 uppercase text-[10px]">
                              {device?.brand} • {device?.year}
                            </span>
                            <Badge variant="pristine" className="text-[9px] py-0 px-1.5">
                              {listing?.condition}
                            </Badge>
                          </div>
                          <Link href={`/listings/${listing?.id}`}>
                            <h4 className="text-sm font-bold text-brown-950 font-display hover:text-burgundy">
                              {listing?.title}
                            </h4>
                          </Link>
                          <p className="text-[11px] text-brown-500 font-mono">
                            {device?.storage} • {device?.ram} RAM • {device?.color}
                          </p>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 border-t sm:border-t-0 border-cream-100 pt-2 sm:pt-0">
                        <span className="text-xl font-black text-burgundy font-display">
                          {formatPrice(item.subtotal ?? ((listing?.price || 0) * (item.quantity || 1)))}
                        </span>
                        <button
                          onClick={() => handleRemove(item.listingId)}
                          disabled={isUpdating}
                          className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Right 4 Cols: Order Summary */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-5 text-xs">
                <h3 className="text-base font-bold text-brown-950 font-display border-b border-cream-200 pb-3">
                  Order Summary
                </h3>

                <div className="space-y-3 text-brown-700">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-mono font-bold text-brown-950">
                      {formatPrice(cart.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <span>Platform & Inspection Fee</span>
                      <span className="text-[10px] text-brown-400 font-mono">(5%)</span>
                    </span>
                    <span className="font-mono font-bold text-brown-950">
                      {formatPrice(cart.platformFee)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>12-Month Certified Warranty</span>
                    <span className="font-bold text-emerald-700">FREE ($0)</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Insured Express Shipping</span>
                    <span className="font-bold text-emerald-700">FREE ($0)</span>
                  </div>

                  <div className="border-t border-cream-200 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-brown-900">Total</span>
                    <span className="text-2xl font-black text-burgundy font-display">
                      {formatPrice(cart.total)}
                    </span>
                  </div>
                </div>

                {/* Carbon Offset Highlight */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-emerald-900 flex items-center gap-2.5">
                  <Leaf className="h-5 w-5 text-emerald-700 shrink-0" />
                  <div className="text-[11px]">
                    <strong>-{cart.carbonOffsetKg}kg CO₂ Offset</strong>
                    <p className="text-emerald-800">Equivalent to planting 3 mature trees.</p>
                  </div>
                </div>

                <Link href="/checkout" className="block pt-1">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full shadow-warm"
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>

                <div className="text-center text-[11px] text-brown-500 flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Stripe 256-bit Encrypted Checkout</span>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
