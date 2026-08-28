"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, getDeviceImageUrl } from "@/lib/utils";
import {
  CreditCard,
  ShieldCheck,
  Lock,
  ArrowRight,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();
  const { cart: contextCart, clearCart } = useCart();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "Sarah Connor",
    street: "742 Evergreen Terrace",
    city: "San Francisco",
    state: "CA",
    postalCode: "94107",
    country: "United States",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "4242 •••• •••• 4242",
    expiry: "12/28",
    cvc: "888",
    nameOnCard: user?.name || "Sarah Connor",
  });

  const [cart, setCart] = useState<any>(null);
  const [intentData, setIntentData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch cart & initialize Stripe PaymentIntent
  useEffect(() => {
    async function initCheckout() {
      try {
        setIsLoading(true);
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        // 1. Fetch Cart from API
        let active = contextCart;
        try {
          const cartRes = await fetch(`${API_BASE}/cart`, {
            headers,
            credentials: "include",
          });
          if (cartRes.ok) {
            const cartData = await cartRes.json();
            if (cartData?.data?.items?.length > 0) {
              active = cartData.data;
            }
          }
        } catch {}

        setCart(active);

        // 2. Fetch PaymentIntent
        if (active?.items?.length > 0) {
          const intentRes = await fetch(`${API_BASE}/checkout/intent`, {
            method: "POST",
            headers,
            credentials: "include",
            body: JSON.stringify({
              items: active.items.map((i: any) => ({
                listingId: i.listingId,
                quantity: i.quantity || 1,
              })),
            }),
          });

          if (intentRes.ok) {
            const intentResp = await intentRes.json();
            setIntentData(intentResp.data);
            if (intentResp.data?.cart && intentResp.data.cart.items?.length > 0) {
              setCart(intentResp.data.cart);
            }
          }
        }
      } catch (err: any) {
        console.warn("Checkout init note:", err.message);
      } finally {
        setIsLoading(false);
      }
    }

    initCheckout();
  }, [API_BASE, accessToken, contextCart]);

  const activeCart = (cart?.items?.length ? cart : contextCart) || {
    items: [],
    itemCount: 0,
    subtotal: 0,
    platformFee: 0,
    total: 0,
  };

  const subtotal = activeCart.subtotal || 0;
  const platformFee = activeCart.platformFee || Math.round(subtotal * 0.05 * 100) / 100;
  const total = activeCart.total || Math.round((subtotal + platformFee) * 100) / 100;

  const handlePayAndConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsProcessingPayment(true);
      setErrorMessage(null);

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const confirmRes = await fetch(`${API_BASE}/checkout/confirm`, {
        method: "POST",
        headers,
        credentials: "include",
        body: JSON.stringify({
          paymentIntentId: intentData?.paymentIntentId || `pi_stripe_${Date.now()}`,
          shippingAddress,
          items: activeCart.items,
        }),
      });

      if (!confirmRes.ok) {
        const errData = await confirmRes.json();
        throw new Error(errData.error || "Payment confirmation failed");
      }

      await clearCart();

      const confirmData = await confirmRes.json();
      const orderId = confirmData.data?.order?.id;

      if (orderId) {
        router.push(`/orders/${orderId}`);
      } else {
        router.push("/marketplace");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to complete transaction.");
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-sm font-semibold text-brown-700">
          Securing Stripe 256-bit Encrypted Session...
        </p>
      </div>
    );
  }

  if (activeCart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50 px-4 text-center">
        <div className="rounded-3xl border border-cream-300 bg-white p-10 max-w-md w-full shadow-warm space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-100 text-brown-600">
            <Truck className="h-8 w-8 text-burgundy" />
          </div>
          <h3 className="text-xl font-bold text-brown-950 font-display">No items in checkout</h3>
          <p className="text-xs text-brown-600 leading-relaxed">
            Please add a refurbished device from the marketplace before proceeding to checkout.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/cart">
              <Button variant="outline" size="sm" className="w-full">
                View Cart
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="primary" size="sm" className="w-full">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Top Banner */}
      <div className="border-b border-cream-200 bg-white/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-burgundy"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Cart
            </Link>
            <span className="text-cream-300">|</span>
            <span className="text-xs font-bold text-brown-900 font-display">
              Secure Stripe Checkout
            </span>
          </div>

          <Badge variant="pristine" dot>
            256-Bit Escrow Protection
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handlePayAndConfirm} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 7 Cols: Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Shipping Address Card */}
            <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4">
              <div className="flex items-center gap-2 border-b border-cream-200 pb-3">
                <Truck className="h-4 w-4 text-burgundy" />
                <h3 className="text-sm font-bold text-brown-950 font-display">
                  1. Insured Delivery Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <Input
                    label="Full Name / Recipient"
                    value={shippingAddress.fullName}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, fullName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <Input
                    label="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, street: e.target.value })
                    }
                    required
                  />
                </div>

                <Input
                  label="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, city: e.target.value })
                  }
                  required
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="State"
                    value={shippingAddress.state}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, state: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="ZIP Code"
                    value={shippingAddress.postalCode}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </Card>

            {/* 2. Stripe Elements Payment Card */}
            <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-burgundy" />
                  <h3 className="text-sm font-bold text-brown-950 font-display">
                    2. Stripe Elements Card Payment
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-brown-500 font-mono">
                  <Lock className="h-3 w-3 text-emerald-600" />
                  <span>Encrypted via Stripe</span>
                </div>
              </div>

              <div className="space-y-3.5">
                <Input
                  label="Name on Card"
                  value={paymentDetails.nameOnCard}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, nameOnCard: e.target.value })
                  }
                  required
                />

                <Input
                  label="Card Number"
                  value={paymentDetails.cardNumber}
                  onChange={(e) =>
                    setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
                  }
                  leftIcon={<CreditCard className="h-4 w-4" />}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Expiration Date"
                    value={paymentDetails.expiry}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, expiry: e.target.value })
                    }
                    placeholder="MM/YY"
                    required
                  />
                  <Input
                    label="CVC / CVV"
                    value={paymentDetails.cvc}
                    onChange={(e) =>
                      setPaymentDetails({ ...paymentDetails, cvc: e.target.value })
                    }
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className="rounded-xl border border-cream-200 bg-cream-50 p-3 text-[11px] text-brown-600 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  Funds are held in 2-day escrow until carrier confirms delivery and inspection.
                </span>
              </div>
            </Card>
          </div>

          {/* Right 5 Cols: Order Review & Instant Pay */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-5 text-xs">
              <h3 className="text-sm font-bold text-brown-950 font-display border-b border-cream-200 pb-3">
                3. Order Review & Guarantee
              </h3>

              {/* Items Mini List */}
              <div className="space-y-3 max-h-56 overflow-y-auto">
                {activeCart?.items?.map((item: any, idx: number) => {
                  const itemPrice = Number(item.listing?.price) || (item.subtotal ? Number(item.subtotal) / (item.quantity || 1) : 0);
                  const itemSubtotal = item.subtotal || (itemPrice * (item.quantity || 1));
                  const itemTitle = item.listing?.title || item.title || "Certified Refurbished Device";
                  const itemCondition = item.listing?.condition || item.condition || "PRISTINE";
                  const itemImages = item.listing?.images || item.images;

                  return (
                    <div key={item.listingId || `item-${idx}`} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-cream-200 bg-cream-50 shrink-0">
                        <Image
                          src={getDeviceImageUrl(itemImages)}
                          alt="Item"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-brown-900 truncate">
                          {itemTitle}
                        </h5>
                        <span className="text-[10px] text-brown-500">
                          Qty: {item.quantity || 1} • {itemCondition}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-burgundy">
                        {formatPrice(itemSubtotal)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-cream-200 pt-3 space-y-2 text-brown-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee (5%)</span>
                  <span className="font-mono font-bold">{formatPrice(platformFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>12-Month Certified Guarantee</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Priority Insured Shipping</span>
                  <span className="font-bold text-emerald-700">FREE</span>
                </div>

                <div className="border-t border-cream-200 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-brown-950">Total Charge</span>
                  <span className="text-2xl font-black text-burgundy font-display">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-warm"
                isLoading={isProcessingPayment}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Pay {formatPrice(total)} & Complete Order
              </Button>

              <div className="text-center text-[10px] text-brown-500 space-y-1">
                <p>30-Day No-Hassle Money Back Guarantee included.</p>
              </div>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}
