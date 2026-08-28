"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchListingById } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { AgentDecisionCard } from "@/components/agent/AgentDecisionCard";
import { formatPrice, parseImages, DEFAULT_DEVICE_IMAGE } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  Cpu,
  BatteryCharging,
  Leaf,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Store,
  Star,
  Calendar,
  Layers,
  ArrowRight,
  Loader2,
  Award,
  AlertTriangle,
  History,
  QrCode,
  FileCheck2,
  ShoppingBag,
  Check,
  Lock,
  ArrowLeft,
  Heart,
  Share2,
  Wrench,
  Flame,
  CreditCard,
  Zap,
} from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const { addToCart, cart } = useCart();
  const { isAuthenticated } = useAuth();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["listing_detail", id],
    queryFn: () => fetchListingById(id),
    enabled: !!id,
  });

  const listing = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-sm font-semibold text-brown-700">Loading Device & Digital Life Passport...</p>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-cream-50">
        <div className="max-w-md text-center rounded-2xl border border-cream-300 bg-white p-8 shadow-warm">
          <h2 className="text-xl font-bold text-brown-900 font-display">Listing Not Found</h2>
          <p className="text-xs text-brown-600 mt-2 mb-6">
            This listing may have been sold or archived from the circular marketplace.
          </p>
          <Button variant="primary" size="sm" onClick={() => router.push("/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const device = listing.device;
  const seller = listing.seller;
  const sellerProfile = seller?.sellerProfile;
  const score = device?.secondLifeScores?.[0];
  const sustainability = device?.sustainabilityRecords?.[0];
  const aiDecision = device?.aiDecisions?.[0];
  const passport = device?.digitalPassport;

  const parsedImages = parseImages(listing.images);
  const images = parsedImages.length > 0 ? parsedImages : [DEFAULT_DEVICE_IMAGE];

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Breadcrumbs */}
      <div className="border-b border-cream-200 bg-white/70 py-3">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-brown-600">
          <div className="flex items-center gap-2">
            <Link href="/marketplace" className="hover:text-burgundy flex items-center gap-1 font-medium">
              <ArrowLeft className="h-3.5 w-3.5" /> Marketplace
            </Link>
            <span>/</span>
            <span>{device?.brand}</span>
            <span>/</span>
            <span className="font-semibold text-brown-900 truncate max-w-[200px]">{listing.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 hover:text-burgundy">
              <Share2 className="h-3.5 w-3.5" /> Share
            </button>
            <button className="flex items-center gap-1 hover:text-burgundy">
              <Heart className="h-3.5 w-3.5" /> Wishlist
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* Top Product Hero: Gallery + Buying Details */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Left 6 Cols: Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage Image */}
            <div className="relative h-[380px] sm:h-[480px] w-full overflow-hidden rounded-2xl border border-cream-300 bg-white shadow-warm">
              <Image
                src={images[activeImageIndex] || images[0]}
                alt={listing.title}
                fill
                priority
                className="object-contain p-4 transition-all duration-300"
              />
              <div className="absolute top-4 left-4">
                <Badge
                  variant={
                    listing.condition === "PRISTINE"
                      ? "pristine"
                      : listing.condition === "EXCELLENT"
                      ? "excellent"
                      : "good"
                  }
                  className="text-xs px-3 py-1 font-bold"
                >
                  {listing.condition} Condition
                </Badge>
              </div>
              <div className="absolute bottom-4 right-4 rounded-xl bg-brown-950/80 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-cream" /> 12-Month ReTech Warranty
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                      activeImageIndex === idx ? "border-burgundy ring-2 ring-burgundy/20" : "border-cream-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right 6 Cols: Product Details & Buying Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-brown-500 mb-2">
                <span className="font-semibold text-brown-800">
                  {device?.brand} • {device?.year} Edition
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <Leaf className="h-3.5 w-3.5" /> -{sustainability?.co2SavedKg || 58.4}kg CO₂ Avoided
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-brown-950 font-display leading-tight">
                {listing.title}
              </h1>
            </div>

            {/* Price Badge */}
            <div className="flex items-baseline gap-4 border-y border-cream-300 py-4">
              <span className="text-4xl font-black text-burgundy font-display">
                {formatPrice(listing.price)}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                Guaranteed Circular Pricing
              </span>
            </div>

            {/* Key Specs Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="rounded-xl border border-cream-300 bg-white p-3 shadow-sm">
                <span className="text-brown-500 block text-[11px]">Storage</span>
                <strong className="text-brown-900">{device?.storage}</strong>
              </div>
              <div className="rounded-xl border border-cream-300 bg-white p-3 shadow-sm">
                <span className="text-brown-500 block text-[11px]">RAM</span>
                <strong className="text-brown-900">{device?.ram}</strong>
              </div>
              <div className="rounded-xl border border-cream-300 bg-white p-3 shadow-sm">
                <span className="text-brown-500 block text-[11px]">Color</span>
                <strong className="text-brown-900">{device?.color}</strong>
              </div>
              <div className="rounded-xl border border-cream-300 bg-white p-3 shadow-sm">
                <span className="text-brown-500 block text-[11px]">Model Year</span>
                <strong className="text-brown-900">{device?.year}</strong>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="rounded-2xl border border-cream-300 bg-white p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brown-100 text-brown-800">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-brown-900 font-display">
                      {sellerProfile?.businessName || seller?.name || "Verified Refurbisher"}
                    </span>
                    {sellerProfile?.verified && (
                      <Badge variant="pristine" className="text-[9px] py-0 px-1">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-brown-600 mt-0.5">
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                      {sellerProfile?.rating ? sellerProfile.rating.toFixed(1) : "4.9"} rating
                    </span>
                    <span>•</span>
                    <span>{sellerProfile?.totalSales || 420}+ circular sales</span>
                  </div>
                </div>
              </div>

              <span className="rounded-lg bg-cream-100 px-2.5 py-1 text-[11px] font-semibold text-brown-700">
                1-2 Day Dispatch
              </span>
            </div>

            {/* Action CTAs: Add to Cart & Place Order */}
            <div className="space-y-3 pt-2">
              {isAddedToCart && (
                <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 flex items-center justify-between text-xs text-emerald-900 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold">Added to your shopping cart!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/cart"
                      className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors"
                    >
                      View Cart ({cart.itemCount})
                    </Link>
                    <Link
                      href="/checkout"
                      className="px-2.5 py-1 rounded-lg bg-burgundy hover:bg-burgundy-600 text-white font-bold transition-colors"
                    >
                      Proceed to Checkout →
                    </Link>
                  </div>
                </div>
              )}

              {/* Side-by-Side: Add to Cart + Place Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Add to Cart Button */}
                <Button
                  variant="outline"
                  size="lg"
                  className={`w-full border-2 font-bold transition-all shadow-sm ${
                    isAddedToCart
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                      : "border-burgundy text-burgundy hover:bg-burgundy/5"
                  }`}
                  leftIcon={isAddedToCart ? <Check className="h-4 w-4 text-emerald-600" /> : <ShoppingBag className="h-4 w-4" />}
                  disabled={isAdding || isPlacingOrder}
                  onClick={async () => {
                    if (!isAuthenticated) {
                      router.push(`/?redirect=${encodeURIComponent(`/listings/${id}`)}`);
                      return;
                    }
                    if (!listing) return;
                    setIsAdding(true);
                    await addToCart(listing, 1);
                    setIsAddedToCart(true);
                    setIsAdding(false);
                  }}
                >
                  {isAdding ? "Adding..." : isAddedToCart ? "In Cart ✓" : "Add to Cart"}
                </Button>

                {/* 2. Place Order (Direct Checkout) Button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-burgundy hover:bg-burgundy-600 text-white font-bold shadow-warm flex items-center justify-center gap-2"
                  disabled={isAdding || isPlacingOrder}
                  onClick={async () => {
                    if (!isAuthenticated) {
                      router.push(`/?redirect=${encodeURIComponent(`/listings/${id}`)}`);
                      return;
                    }
                    if (!listing) return;
                    setIsPlacingOrder(true);
                    await addToCart(listing, 1);
                    router.push("/checkout");
                  }}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Opening Checkout...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>Place Order</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>

              {/* 3. View Digital Passport CTA */}
              <Button
                variant="secondary"
                size="md"
                className="w-full border border-cream-300 bg-cream-100/70 hover:bg-cream-200 text-brown-900 font-semibold"
                leftIcon={<QrCode className="h-4 w-4 text-burgundy" />}
                onClick={() => setIsPassportModalOpen(true)}
              >
                Inspect Digital Life Passport & Hardware History
              </Button>

              <div className="rounded-xl border border-cream-200 bg-cream-100/60 p-3 text-center text-xs text-brown-700 flex items-center justify-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>30-Day Money Back Guarantee • Free Insured Express Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: AI Diagnostic Decision & Second Life Score */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* AI Decision Card with Goal-to-Decision Loop */}
          <div className="lg:col-span-6">
            <AgentDecisionCard
              deviceId={device?.id || id}
              deviceTitle={listing.title}
              initialDecision={{
                recommendation: (aiDecision?.recommendation as any) || "BUY",
                confidence: aiDecision?.confidence ? aiDecision.confidence * 100 : 96,
                reasoning: aiDecision?.reasoning,
                keyFactors: [
                  `Exceptional Component Health: Second-Life score of ${score?.score || 96}/100 with verified 42-point hardware audit.`,
                  `Fair Circular Market Value: Priced competitively with guaranteed 12-month ReTech coverage.`,
                  `Verified Cryptographic Security: DoD 5220.22-M data sanitization certified on Digital Life Passport.`,
                ],
                riskFlags: [],
              }}
            />
          </div>

          {/* Second Life Score Breakdown */}
          <div className="lg:col-span-6">
            <Card className="border-cream-300 bg-white h-full p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brown-700 text-white">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-brown-900 font-display">
                      Second-Life Score Index
                    </h3>
                    <p className="text-xs text-brown-500">Multidimensional Component Health</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-burgundy font-display">
                    {score?.score || 96.5}
                  </span>
                  <span className="text-xs text-brown-400 font-semibold"> / 100</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-cream-200 p-3 bg-cream-50">
                  <div className="flex items-center justify-between text-brown-700 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <BatteryCharging className="h-3.5 w-3.5 text-emerald-600" /> Battery Health
                    </span>
                    <strong className="text-brown-900">{score?.breakdown?.batteryHealth || 94}%</strong>
                  </div>
                  <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${score?.breakdown?.batteryHealth || 94}%` }} />
                  </div>
                </div>

                <div className="rounded-xl border border-cream-200 p-3 bg-cream-50">
                  <div className="flex items-center justify-between text-brown-700 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles className="h-3.5 w-3.5 text-burgundy" /> Cosmetic Index
                    </span>
                    <strong className="text-brown-900">{score?.breakdown?.cosmeticIndex || 98}%</strong>
                  </div>
                  <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
                    <div className="h-full bg-burgundy" style={{ width: `${score?.breakdown?.cosmeticIndex || 98}%` }} />
                  </div>
                </div>

                <div className="rounded-xl border border-cream-200 p-3 bg-cream-50">
                  <div className="flex items-center justify-between text-brown-700 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" /> Screen Integrity
                    </span>
                    <strong className="text-brown-900">{score?.breakdown?.screenIntegrity || 100}%</strong>
                  </div>
                  <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
                    <div className="h-full bg-teal-500" style={{ width: `${score?.breakdown?.screenIntegrity || 100}%` }} />
                  </div>
                </div>

                <div className="rounded-xl border border-cream-200 p-3 bg-cream-50">
                  <div className="flex items-center justify-between text-brown-700 mb-1">
                    <span className="flex items-center gap-1 font-medium">
                      <Flame className="h-3.5 w-3.5 text-amber-600" /> Thermal Efficiency
                    </span>
                    <strong className="text-brown-900">{score?.breakdown?.thermalEfficiency || 97}%</strong>
                  </div>
                  <div className="h-1.5 rounded-full bg-cream-200 overflow-hidden">
                    <div className="h-full bg-amber-500" style={{ width: `${score?.breakdown?.thermalEfficiency || 97}%` }} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Digital Life Passport Timeline Preview */}
        <Card className="border-cream-300 bg-white p-6">
          <div className="flex items-center justify-between border-b border-cream-200 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-brown-900 font-display">
                  Digital Life Passport™
                </h3>
                <Badge variant="pristine">Cryptographically Verified</Badge>
              </div>
              <p className="text-xs text-brown-600 mt-0.5">
                Immutable lifecycle audit trail from OEM factory to circular refurbishment.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPassportModalOpen(true)}>
              Full Passport Modal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <div className="flex items-center gap-2 font-bold text-brown-900 mb-2">
                <Lock className="h-4 w-4 text-burgundy" /> DoD 5220.22-M Data Wipe
              </div>
              <p className="text-brown-600 leading-relaxed">
                Cryptographic sanitization executed. All previous cryptographic keys and sectors zeroed.
              </p>
              <span className="text-[10px] text-brown-500 block mt-2 font-mono">
                Verified: ReTech AutoWipe
              </span>
            </div>

            <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <div className="flex items-center gap-2 font-bold text-brown-900 mb-2">
                <Wrench className="h-4 w-4 text-brown-700" /> Certified OEM Servicing
              </div>
              <p className="text-brown-600 leading-relaxed">
                Thermal compound renewed with high-efficiency paste. Connector gaskets verified waterproof.
              </p>
              <span className="text-[10px] text-brown-500 block mt-2 font-mono">
                Verified: Elena Rostova (AI Lead)
              </span>
            </div>

            <div className="rounded-xl border border-cream-200 bg-cream-50 p-4">
              <div className="flex items-center gap-2 font-bold text-brown-900 mb-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Guarantee Issuance
              </div>
              <p className="text-brown-600 leading-relaxed">
                12-month comprehensive warranty minted and attached to IMEI: {device?.imei}.
              </p>
              <span className="text-[10px] text-brown-500 block mt-2 font-mono">
                Verified: ReTech Quality Board
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Digital Life Passport Modal */}
      <Modal
        isOpen={isPassportModalOpen}
        onClose={() => setIsPassportModalOpen(false)}
        title={`Digital Life Passport: ${device?.brand} ${device?.model}`}
        description={`IMEI: ${device?.imei} • Immutable Circular Lifecycle Log`}
        className="max-w-2xl"
      >
        <div className="space-y-4 pt-2 text-xs">
          <div className="grid grid-cols-2 gap-3 bg-cream-100 rounded-xl p-3 border border-cream-300">
            <div>
              <span className="text-brown-500 block">Previous Owners</span>
              <strong className="text-brown-900">{passport?.previousOwners || 1} verified owner</strong>
            </div>
            <div>
              <span className="text-brown-500 block">Original Purchase Date</span>
              <strong className="text-brown-900">
                {passport?.originalPurchaseDate
                  ? new Date(passport.originalPurchaseDate).toLocaleDateString()
                  : "January 2023"}
              </strong>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-brown-900 uppercase tracking-wider text-[11px]">
              Verified Event Log
            </h4>
            {(passport?.entries && passport.entries.length > 0
              ? passport.entries
              : [
                  {
                    type: "FACTORY_RESET",
                    description: "Cryptographic DoD 5220.22-M 3-pass data wipe completed.",
                    verifiedBy: "ReTech Automated Wipe System",
                    date: new Date().toISOString(),
                  },
                  {
                    type: "INSPECTION",
                    description: "42-point AI optical and subpixel array diagnostic completed.",
                    verifiedBy: "Elena Rostova (AI Lead)",
                    date: new Date().toISOString(),
                  },
                  {
                    type: "CERTIFICATION",
                    description: "Issued 12-Month ReTech Guaranteed Certificate.",
                    verifiedBy: "ReTech Quality Board",
                    date: new Date().toISOString(),
                  },
                ]
            ).map((entry: any, i: number) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border border-cream-200 p-3 bg-white">
                <div className="p-1.5 rounded-md bg-burgundy/10 text-burgundy shrink-0 mt-0.5">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brown-900">{entry.type}</span>
                    <span className="text-[10px] text-brown-400 font-mono">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-brown-600 mt-0.5">{entry.description}</p>
                  <span className="text-[10px] font-semibold text-emerald-700 mt-1 block">
                    Verified By: {entry.verifiedBy}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3 border-t border-cream-200">
            <Button variant="primary" size="sm" onClick={() => setIsPassportModalOpen(false)}>
              Close Passport
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
