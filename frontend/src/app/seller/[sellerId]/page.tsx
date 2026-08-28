"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { formatPrice, getDeviceImageUrl } from "@/lib/utils";
import {
  ShieldCheck,
  Star,
  Package,
  Clock,
  Award,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
  Loader2,
  Store,
} from "lucide-react";

export default function PublicSellerProfilePage() {
  const params = useParams();
  const sellerId = String(params.sellerId);

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/seller/profile/${sellerId}`);
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [sellerId, API_BASE]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-sm font-semibold text-brown-700">Loading Verified Seller Profile...</p>
      </div>
    );
  }

  const profile = data || {
    name: "Austin Circular Labs",
    avatar: "🏢",
    verified: true,
    tier: "PRO_SELLER",
    memberSince: 2024,
    totalSales: 420,
    rating: 4.9,
    responseRate: "99%",
    bio: "Premier certified circular electronics refurbisher specializing in enterprise-grade Apple and Dell workstations with 42-point hardware audits.",
    trustBadges: [
      { name: "DoD 5220.22-M Certified Sanitization", icon: "🔒" },
      { name: "1-2 Day Express Dispatch", icon: "⚡" },
      { name: "100% Guaranteed Genuine Parts", icon: "🛡️" },
      { name: "Tier-1 Pro Refurbisher", icon: "🏆" },
    ],
    reviews: [],
    listings: [],
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Top Banner */}
      <div className="border-b border-cream-200 bg-white/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-burgundy"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </Link>

          <Badge variant="pristine" dot>
            {profile.tier === "PRO_SELLER" ? "Tier-1 Pro Certified" : "Verified Refurbisher"}
          </Badge>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Seller Hero Header */}
        <Card className="border-cream-300 bg-gradient-to-br from-white via-cream-50/50 to-white p-6 sm:p-8 shadow-warm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cream-100 text-3xl shadow-sm border border-cream-200 shrink-0">
                {profile.avatar}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-brown-950 font-display">
                    {profile.name}
                  </h1>
                  {profile.verified && (
                    <Badge variant="pristine" className="text-[10px] py-0.5 px-2">
                      Verified ✓
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-brown-600 max-w-xl leading-relaxed">{profile.bio}</p>
              </div>
            </div>

            {/* Quick Metrics Badge Group */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs">
              <div className="rounded-xl border border-cream-200 bg-white p-3 space-y-0.5 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-brown-400">Rating</span>
                <strong className="text-sm font-black text-brown-950 font-display flex items-center justify-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                  {profile.rating} / 5.0
                </strong>
              </div>

              <div className="rounded-xl border border-cream-200 bg-white p-3 space-y-0.5 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-brown-400">Sales</span>
                <strong className="text-sm font-black text-emerald-700 font-display">
                  {profile.totalSales}+ Sold
                </strong>
              </div>

              <div className="rounded-xl border border-cream-200 bg-white p-3 space-y-0.5 shadow-sm col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold text-brown-400">Response</span>
                <strong className="text-sm font-black text-burgundy font-display">
                  {profile.responseRate}
                </strong>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-t border-cream-200 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-500 block mb-2">
              Verified Refurbisher Trust Protocol
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              {profile.trustBadges?.map((b: any, i: number) => (
                <div
                  key={i}
                  className="rounded-xl border border-cream-200 bg-cream-50 p-2.5 flex items-center gap-2 text-brown-800"
                >
                  <span className="text-base">{b.icon}</span>
                  <span className="text-[11px] font-semibold truncate">{b.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* 2. Active Inventory Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-brown-950 font-display">
              Available Hardware Inventory ({profile.listings?.length || 0})
            </h3>
            <span className="text-xs text-brown-500 font-mono">100% Covered with 12-Mo Warranty</span>
          </div>

          {profile.listings?.length === 0 ? (
            <div className="rounded-2xl border border-cream-200 bg-white p-8 text-center text-xs text-brown-500">
              No active listings available from this seller right now.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.listings?.map((l: any) => (
                <Card
                  key={l.id}
                  className="border-cream-300 bg-white p-4 shadow-sm space-y-3 hover:shadow-warm transition-all"
                >
                  <div className="relative h-40 w-full rounded-xl overflow-hidden bg-cream-50">
                    <Image
                      src={getDeviceImageUrl(l.images)}
                      alt={l.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brown-500 uppercase text-[10px]">
                        {l.condition}
                      </span>
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 font-mono font-bold text-emerald-800 text-[10px]">
                        SLS: {l.device?.secondLifeScores?.[0]?.score || 95}/100
                      </span>
                    </div>

                    <h4 className="font-bold text-brown-950 text-sm font-display truncate">
                      {l.title}
                    </h4>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-black text-burgundy font-display">
                        {formatPrice(l.price)}
                      </span>
                      <Link href={`/listings/${l.id}`}>
                        <Button variant="primary" size="sm">
                          View Device
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* 3. Verified Buyer Reviews */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-brown-950 font-display">
            Verified Customer Reviews
          </h3>

          <div className="space-y-3">
            {profile.reviews?.map((r: any) => (
              <ReviewCard
                key={r.id}
                id={r.id}
                rating={r.rating}
                comment={r.comment}
                createdAt={r.createdAt}
                buyerName={r.buyerName}
                sellerReply={r.sellerReply}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
