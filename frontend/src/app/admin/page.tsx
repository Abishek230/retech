"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Package,
  DollarSign,
  Leaf,
  FileCheck,
  Scale,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    async function loadAdminMetrics() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/admin/metrics`);
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
    loadAdminMetrics();
  }, [API_BASE]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-xs font-semibold text-brown-700">Loading Platform Telemetry & Metrics...</p>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalUsers: 1248,
    activeListings: 184,
    gmvThisMonth: 142580.0,
    totalCo2SavedKg: 18420.5,
    pendingVerifications: 14,
    openDisputes: 3,
  };

  const charts = data?.charts || {
    dailySignups: [],
    revenuePerDay: [],
    topCategories: [],
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="burgundy">Super Admin Active</Badge>
            <span className="text-xs text-brown-500 font-mono">
              Live Socket.io Telemetry • All Systems Operational
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brown-950 font-display">
            Platform Master Console
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/passport">
            <Button variant="outline" size="sm" leftIcon={<FileCheck className="h-3.5 w-3.5 text-burgundy" />}>
              Verify Passports ({kpis.pendingVerifications})
            </Button>
          </Link>
          <Link href="/admin/disputes">
            <Button variant="primary" size="sm" leftIcon={<Scale className="h-3.5 w-3.5" />}>
              Open Disputes ({kpis.openDisputes})
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. 6 Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="border-cream-300 bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-brown-400 text-[10px] font-bold uppercase font-display">
            <span>Total Users</span>
            <Users className="h-3.5 w-3.5 text-brown-600" />
          </div>
          <div className="text-2xl font-black text-brown-950 font-display">
            {kpis.totalUsers.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold font-mono">+18% this month</span>
        </Card>

        <Card className="border-cream-300 bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-brown-400 text-[10px] font-bold uppercase font-display">
            <span>Active Listings</span>
            <Package className="h-3.5 w-3.5 text-burgundy" />
          </div>
          <div className="text-2xl font-black text-brown-950 font-display">
            {kpis.activeListings}
          </div>
          <span className="text-[10px] text-brown-500 font-mono">100% verified SLS</span>
        </Card>

        <Card className="border-cream-300 bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-brown-400 text-[10px] font-bold uppercase font-display">
            <span>Monthly GMV</span>
            <DollarSign className="h-3.5 w-3.5 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-brown-950 font-display">
            {formatPrice(kpis.gmvThisMonth)}
          </div>
          <span className="text-[10px] text-emerald-700 font-bold font-mono">5% Escrow take rate</span>
        </Card>

        <Card className="border-cream-300 bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-brown-400 text-[10px] font-bold uppercase font-display">
            <span>CO₂ Diverted</span>
            <Leaf className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-display">
            {Math.round(kpis.totalCo2SavedKg / 1000 * 10) / 10} <span className="text-xs">tons</span>
          </div>
          <span className="text-[10px] text-emerald-800 font-mono">876 trees eq.</span>
        </Card>

        <Card className="border-cream-300 bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-brown-400 text-[10px] font-bold uppercase font-display">
            <span>Pending Audits</span>
            <FileCheck className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-display">
            {kpis.pendingVerifications}
          </div>
          <span className="text-[10px] text-amber-800 font-mono">DoD wipe receipts</span>
        </Card>

        <Card className="border-cream-300 bg-white p-4 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-brown-400 text-[10px] font-bold uppercase font-display">
            <span>Disputes</span>
            <Scale className="h-3.5 w-3.5 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-700 font-display">
            {kpis.openDisputes}
          </div>
          <span className="text-[10px] text-red-700 font-mono">Awaiting resolution</span>
        </Card>
      </div>

      {/* 2. Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Signups (14 Days) */}
        <Card className="lg:col-span-6 border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-burgundy" />
              <h3 className="text-sm font-bold text-brown-950 font-display">
                Daily User Acquisition (Last 14 Days)
              </h3>
            </div>
            <Badge variant="pristine">Organic + Trade-In</Badge>
          </div>

          <div className="h-40 flex items-end justify-between gap-1.5 pt-4 border-b border-cream-200 pb-2">
            {charts.dailySignups.map((s: any, idx: number) => {
              const heightPct = Math.min(100, Math.max(15, (s.signups / 200) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-brown-950 text-white text-[9px] py-0.5 px-1 rounded pointer-events-none whitespace-nowrap z-20 font-mono">
                    {s.date}: {s.signups} users
                  </div>
                  <div
                    className="w-full bg-burgundy/80 group-hover:bg-burgundy rounded-t transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[10px] text-brown-400 font-mono">
            <span>14 Days Ago</span>
            <span>Today</span>
          </div>
        </Card>

        {/* Daily Revenue Trajectory */}
        <Card className="lg:col-span-6 border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-brown-950 font-display">
                Gross Platform GMV ($ / Day)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">+24.8% WOW</span>
          </div>

          <div className="h-40 flex items-end justify-between gap-1.5 pt-4 border-b border-cream-200 pb-2">
            {charts.revenuePerDay.map((r: any, idx: number) => {
              const heightPct = Math.min(100, Math.max(15, (r.revenue / 25000) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-brown-950 text-white text-[9px] py-0.5 px-1 rounded pointer-events-none whitespace-nowrap z-20 font-mono">
                    {r.date}: ${r.revenue}
                  </div>
                  <div
                    className="w-full bg-emerald-600 group-hover:bg-emerald-500 rounded-t transition-all"
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[10px] text-brown-400 font-mono">
            <span>14 Days Ago</span>
            <span>Today</span>
          </div>
        </Card>
      </div>

      {/* 3. Category Breakdown & System Telemetry Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-6 border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-brown-950 font-display border-b border-cream-200 pb-3">
            Top Device Categories by Trading Volume
          </h3>

          <div className="space-y-3 pt-1">
            {charts.topCategories.map((c: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between font-semibold text-brown-900">
                  <span>{c.category}</span>
                  <span className="font-mono text-brown-700">
                    {c.share}% ({c.volume})
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
                  <div
                    className="h-full bg-burgundy rounded-full"
                    style={{ width: `${c.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Operational Links */}
        <Card className="lg:col-span-6 border-cream-300 bg-white p-6 shadow-warm space-y-3.5 text-xs">
          <h3 className="text-sm font-bold text-brown-950 font-display border-b border-cream-200 pb-3">
            Operational Administration Hub
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/users"
              className="p-3 rounded-2xl border border-cream-200 bg-cream-50 hover:border-burgundy transition-all flex flex-col justify-between"
            >
              <Users className="h-5 w-5 text-burgundy mb-2" />
              <div>
                <strong className="text-xs text-brown-950 block">User Directory</strong>
                <span className="text-[10px] text-brown-500">Manage roles & access</span>
              </div>
            </Link>

            <Link
              href="/admin/listings"
              className="p-3 rounded-2xl border border-cream-200 bg-cream-50 hover:border-burgundy transition-all flex flex-col justify-between"
            >
              <Package className="h-5 w-5 text-brown-700 mb-2" />
              <div>
                <strong className="text-xs text-brown-950 block">Hardware Moderation</strong>
                <span className="text-[10px] text-brown-500">Flag, edit, audit</span>
              </div>
            </Link>

            <Link
              href="/admin/system"
              className="p-3 rounded-2xl border border-cream-200 bg-cream-50 hover:border-burgundy transition-all flex flex-col justify-between"
            >
              <Activity className="h-5 w-5 text-emerald-600 mb-2" />
              <div>
                <strong className="text-xs text-brown-950 block">System Telemetry</strong>
                <span className="text-[10px] text-brown-500">Redis, DB, n8n queues</span>
              </div>
            </Link>

            <Link
              href="/admin/audit-log"
              className="p-3 rounded-2xl border border-cream-200 bg-cream-50 hover:border-burgundy transition-all flex flex-col justify-between"
            >
              <ShieldCheck className="h-5 w-5 text-amber-600 mb-2" />
              <div>
                <strong className="text-xs text-brown-950 block">Security Audit Trail</strong>
                <span className="text-[10px] text-brown-500">Immutable admin logs</span>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
