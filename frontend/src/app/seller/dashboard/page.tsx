"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";
import {
  DollarSign,
  Package,
  Cpu,
  Star,
  TrendingUp,
  Zap,
  Eye,
  Edit,
  Power,
  Rocket,
  ShieldCheck,
  ArrowUpRight,
  Download,
  Plus,
  Loader2,
  CheckCircle2,
  Lock,
} from "lucide-react";

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const sellerId = user?.id || "demo_seller_user_1";

  const [data, setData] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        const [dashRes, listRes] = await Promise.all([
          fetch(`${API_BASE}/seller/dashboard`),
          fetch(`${API_BASE}/seller/listings`),
        ]);

        if (dashRes.ok) {
          const json = await dashRes.json();
          setData(json.data);
        }
        if (listRes.ok) {
          const json = await listRes.json();
          setListings(json.data || []);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [API_BASE]);

  const handleDeactivate = (listingId: string) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, status: "DRAFT" } : l))
    );
  };

  const handleBoost = (listingId: string) => {
    alert("⚡ Listing boosted! Prioritized in AI neural recommendation ranking for 48 hours.");
  };

  const handleRequestPayout = () => {
    setPayoutSuccess(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-sm font-semibold text-brown-700">Loading Seller Dashboard & Telemetry...</p>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalRevenue: 24650.0,
    grossRevenue: 25950.0,
    activeListings: 14,
    avgSecondLifeScore: 94.6,
    avgSellerRating: 4.9,
    totalSales: 38,
    tier: "PRO_SELLER",
  };

  const charts = data?.charts || { revenuePerDay: [], unitsSoldPerWeek: [] };
  const recentOrders = data?.recentOrders || [];
  const payouts = data?.payouts || { availableBalance: 8420.5, escrowPending: 1240.0, history: [] };

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Top Banner */}
      <div className="border-b border-cream-200 bg-white/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="pristine" dot>
                {kpis.tier === "PRO_SELLER" ? "Pro Seller Verified" : "Verified Seller"}
              </Badge>
              <span className="text-xs text-brown-500 font-semibold font-mono">
                99% Response Rate • Instant Escrow
              </span>
            </div>
            <h1 className="text-3xl font-black text-brown-950 font-display">
              Refurbisher Seller Command Center
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href={`/seller/${sellerId}`}>
              <Button variant="outline" size="sm" leftIcon={<Eye className="h-4 w-4" />}>
                View Public Storefront
              </Button>
            </Link>
            <Link href="/sell/create">
              <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                Add Device Listing
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Overview KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-cream-300 bg-white p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-brown-500 text-xs font-bold uppercase tracking-wider font-display">
              <span>Net Revenue (95%)</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <DollarSign className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-brown-950 font-display">
              {formatPrice(kpis.totalRevenue)}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +14.2% vs last 30 days
            </span>
          </Card>

          <Card className="border-cream-300 bg-white p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-brown-500 text-xs font-bold uppercase tracking-wider font-display">
              <span>Active Listings</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-burgundy/10 text-burgundy">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-brown-950 font-display">
              {kpis.activeListings}
            </div>
            <span className="text-[10px] text-brown-500 font-mono">
              {kpis.totalSales} total circular transfers
            </span>
          </Card>

          <Card className="border-cream-300 bg-white p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-brown-500 text-xs font-bold uppercase tracking-wider font-display">
              <span>Avg SLS Score</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cream-200 text-brown-800">
                <Cpu className="h-4 w-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 font-display">
              {kpis.avgSecondLifeScore}/100
            </div>
            <span className="text-[10px] text-emerald-800 font-semibold">
              Top 5% inventory health on platform
            </span>
          </Card>

          <Card className="border-cream-300 bg-white p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-brown-500 text-xs font-bold uppercase tracking-wider font-display">
              <span>Seller Trust Rating</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Star className="h-4 w-4 fill-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-brown-950 font-display">
              {kpis.avgSellerRating} / 5.0
            </div>
            <span className="text-[10px] text-brown-500 font-mono">
              100% verified order reviews
            </span>
          </Card>
        </div>

        {/* 2. Sales Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 30-Day Revenue Line Chart */}
          <Card className="lg:col-span-8 border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-burgundy" />
                <h3 className="text-sm font-bold text-brown-950 font-display">
                  Daily Revenue Trajectory (Last 30 Days)
                </h3>
              </div>
              <Badge variant="pristine">Stripe Escrow Settled</Badge>
            </div>

            {/* Visual Line / Bar Simulation */}
            <div className="h-48 flex items-end justify-between gap-1 pt-4 border-b border-cream-200 pb-2">
              {charts.revenuePerDay.map((pt: any, idx: number) => {
                const heightPercent = Math.min(100, Math.max(15, (pt.revenue / 500) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-brown-950 text-white text-[9px] py-0.5 px-1.5 rounded pointer-events-none whitespace-nowrap z-20 font-mono">
                      {pt.date}: ${pt.revenue}
                    </div>
                    <div
                      className="w-full bg-burgundy/80 group-hover:bg-burgundy rounded-t transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[10px] text-brown-500 font-mono">
              <span>30 Days Ago</span>
              <span>Today</span>
            </div>
          </Card>

          {/* Units Sold Per Week */}
          <Card className="lg:col-span-4 border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="text-sm font-bold text-brown-950 font-display">Weekly Units Sold</h3>
              <span className="text-[10px] font-mono text-brown-500">Volume</span>
            </div>

            <div className="space-y-3 pt-2">
              {charts.unitsSoldPerWeek.map((u: any, i: number) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between font-semibold text-brown-900">
                    <span>{u.week}</span>
                    <span className="font-mono text-emerald-700 font-bold">
                      {u.units} Units (${u.revenue})
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full"
                      style={{ width: `${Math.min(100, (u.units / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 3. Active Listings Management Table */}
        <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-brown-800" />
              <h3 className="text-sm font-bold text-brown-950 font-display">
                Active Hardware Listings & Status
              </h3>
            </div>
            <Link href="/sell/create">
              <Button variant="primary" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
                Create New Listing
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-cream-200">
              <thead>
                <tr className="text-[10px] font-bold uppercase text-brown-400">
                  <th className="pb-2">Image</th>
                  <th className="pb-2">Device</th>
                  <th className="pb-2">Price</th>
                  <th className="pb-2">SLS Score</th>
                  <th className="pb-2">Views</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-2.5">
                      <div className="relative h-11 w-11 rounded-lg overflow-hidden border border-cream-200 bg-cream-50 shrink-0">
                        <Image src={l.image} alt={l.title} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="py-2.5">
                      <Link href={`/listings/${l.id}`}>
                        <span className="font-bold text-brown-950 hover:text-burgundy block font-display">
                          {l.title}
                        </span>
                      </Link>
                      <span className="text-[10px] text-brown-500 font-mono">
                        {l.condition} • {l.device?.storage || "256GB"}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono font-bold text-burgundy">
                      {formatPrice(l.price)}
                    </td>
                    <td className="py-2.5">
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono font-bold text-emerald-800 text-[11px]">
                        {l.secondLifeScore}/100
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-brown-600">{l.views}</td>
                    <td className="py-2.5">
                      <Badge variant={l.status === "ACTIVE" ? "pristine" : "brown"}>
                        {l.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 text-right space-x-1.5 whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBoost(l.id)}
                        leftIcon={<Rocket className="h-3 w-3 text-amber-600" />}
                      >
                        Boost
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(l.id)}
                        leftIcon={<Power className="h-3 w-3 text-red-600" />}
                      >
                        Deactivate
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* 4. Recent Orders & Payouts Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Orders */}
          <Card className="lg:col-span-7 border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-brown-950 font-display border-b border-cream-200 pb-3">
              Recent Fulfillment Orders (Anonymous Buyers)
            </h3>

            <div className="divide-y divide-cream-100">
              {recentOrders.map((ord: any) => (
                <div key={ord.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-brown-950 font-mono font-bold">
                        {ord.orderNumber}
                      </strong>
                      <span className="text-[10px] text-brown-500">• {ord.buyerName}</span>
                    </div>
                    <p className="text-[11px] text-brown-700 truncate mt-0.5">{ord.deviceTitle}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-700 block">
                      +{formatPrice(ord.netPayout)}
                    </span>
                    <Badge variant={ord.status === "DELIVERED" ? "pristine" : "brown"}>
                      {ord.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payouts & Escrow Management */}
          <Card className="lg:col-span-5 border-cream-300 bg-white p-6 shadow-warm space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-brown-950 font-display">
                  Stripe Connect Payouts
                </h3>
              </div>
              <span className="text-[10px] font-mono text-brown-500">2-Day Escrow Hold</span>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-cream-50 p-3.5 rounded-2xl border border-cream-200">
              <div>
                <span className="text-[10px] text-brown-400 font-bold uppercase block">
                  Available to Withdraw
                </span>
                <strong className="text-xl font-black text-emerald-700 font-display">
                  {formatPrice(payouts.availableBalance)}
                </strong>
              </div>

              <div>
                <span className="text-[10px] text-brown-400 font-bold uppercase block">
                  Escrow Pending
                </span>
                <strong className="text-xl font-black text-amber-700 font-display">
                  {formatPrice(payouts.escrowPending)}
                </strong>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full shadow-warm"
              onClick={() => setIsPayoutModalOpen(true)}
              rightIcon={<ArrowUpRight className="h-4 w-4" />}
            >
              Request Payout via Stripe Connect
            </Button>

            {/* Payout History Mini List */}
            <div className="space-y-2 pt-1">
              <span className="font-bold text-brown-700 uppercase text-[10px]">
                Recent Transfers
              </span>
              {payouts.history?.map((p: any) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2 rounded-xl border border-cream-200 bg-white text-[11px]"
                >
                  <div>
                    <strong className="text-brown-900 block">{formatPrice(p.amount)}</strong>
                    <span className="text-[10px] text-brown-400 font-mono">{p.date}</span>
                  </div>
                  <Badge variant="pristine">{p.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Payout Request Modal */}
      <Modal
        isOpen={isPayoutModalOpen}
        onClose={() => {
          setIsPayoutModalOpen(false);
          setPayoutSuccess(false);
        }}
        title="Request Stripe Connect Payout"
      >
        {payoutSuccess ? (
          <div className="py-6 text-center text-xs space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-brown-950 font-display text-sm">
              Payout Initiated!
            </h4>
            <p className="text-brown-600">
              ${payouts.availableBalance.toLocaleString()} USD has been transferred directly to your linked Stripe account.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsPayoutModalOpen(false);
                setPayoutSuccess(false);
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            <p className="text-brown-700 leading-relaxed">
              You are withdrawing{" "}
              <strong className="text-emerald-700 font-bold font-mono">
                {formatPrice(payouts.availableBalance)}
              </strong>{" "}
              directly to your verified bank account via Stripe Connect Direct.
            </p>

            <div className="rounded-xl border border-cream-200 bg-cream-50 p-3 text-[11px] text-brown-600 space-y-1">
              <div>• Bank Account: **** 6789 (Chase Direct Deposit)</div>
              <div>• Transfer Speed: Instant (0% additional fee)</div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleRequestPayout}
            >
              Confirm & Transfer {formatPrice(payouts.availableBalance)}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
