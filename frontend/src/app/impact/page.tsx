"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ImpactCounter } from "@/components/sustainability/ImpactCounter";
import { EcoMeter } from "@/components/sustainability/EcoMeter";
import { ImpactBadge } from "@/components/sustainability/ImpactBadge";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Leaf,
  Droplets,
  Trash2,
  TreeDeciduous,
  Car,
  Globe,
  Award,
  ArrowRight,
  TrendingUp,
  Loader2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function UserImpactPage() {
  const { user } = useAuth();
  const userId = user?.id || "demo_buyer_user_1";

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    async function loadImpact() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/sustainability/user/${userId}`);
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
    loadImpact();
  }, [userId, API_BASE]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-sm font-semibold text-brown-700">
          Calculating Your Personal Environmental Impact...
        </p>
      </div>
    );
  }

  const totals = data?.totals || {
    co2SavedKg: 128.5,
    eWasteAvoidedKg: 0.85,
    treesEquivalent: 6.1,
    waterLiters: 780,
    carMilesEquivalent: 314,
  };

  const badges = data?.badges || [];
  const monthlyChart = data?.monthlyChart || [];
  const deviceContributions = data?.deviceContributions || [];

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Top Banner */}
      <div className="border-b border-cream-200 bg-white/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="pristine" dot>
                Personal Eco Ledger
              </Badge>
              <span className="text-xs text-brown-500 font-semibold">
                Lifecycle Carbon & Material Accounting
              </span>
            </div>
            <h1 className="text-3xl font-black text-brown-950 font-display">
              Your Environmental Impact
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/impact/platform">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Globe className="h-4 w-4 text-burgundy" />}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Global Platform Impact
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Four Key Impact Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ImpactCounter
            label="Carbon Avoided"
            value={totals.co2SavedKg}
            unit="kg CO₂"
            subtext={`Equivalent to ${totals.carMilesEquivalent} gasoline car miles.`}
            icon={<Leaf className="h-5 w-5" />}
            variant="emerald"
          />

          <ImpactCounter
            label="E-Waste Diverted"
            value={totals.eWasteAvoidedKg}
            unit="kg"
            subtext="Toxic heavy metals kept out of landfills."
            icon={<Trash2 className="h-5 w-5" />}
            variant="brown"
          />

          <ImpactCounter
            label="Tree Equivalents"
            value={totals.treesEquivalent}
            unit="Trees / Yr"
            subtext="Annual CO₂ absorption of mature urban trees."
            icon={<TreeDeciduous className="h-5 w-5" />}
            variant="emerald"
          />

          <ImpactCounter
            label="Water Conserved"
            value={totals.waterLiters}
            unit="Liters"
            subtext="Mining & semiconductor cooling water saved."
            icon={<Droplets className="h-5 w-5" />}
            variant="amber"
          />
        </div>

        {/* 2. Eco Progress & Badges Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 space-y-4">
            <EcoMeter
              currentCO2={totals.co2SavedKg}
              nextTierCO2={200}
              currentLevelName={totals.co2SavedKg >= 200 ? "Eco Warrior" : "Green Starter"}
              nextLevelName="Eco Warrior"
            />

            <Card className="border-cream-300 bg-gradient-to-br from-cream-100 to-cream-50 p-6 shadow-sm space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-brown-900 font-display">
                <Car className="h-4 w-4 text-emerald-700" />
                <span>Real-World Benchmark</span>
              </div>
              <p className="text-brown-700 leading-relaxed">
                By purchasing refurbished devices on ReTech, you have prevented{" "}
                <strong className="text-brown-950 font-bold">
                  {totals.co2SavedKg}kg of CO₂
                </strong>{" "}
                from entering the atmosphere—the equivalent of driving{" "}
                <strong className="text-emerald-800 font-bold font-mono">
                  {totals.carMilesEquivalent} miles
                </strong>{" "}
                in an average passenger vehicle.
              </p>
            </Card>
          </div>

          <div className="lg:col-span-8">
            <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-burgundy" />
                  <h3 className="text-sm font-bold text-brown-950 font-display">
                    Unlocked Eco Badges
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-700">
                  {badges.filter((b: any) => b.unlocked).length} of {badges.length} Unlocked
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {badges.map((badge: any) => (
                  <ImpactBadge
                    key={badge.id}
                    name={badge.name}
                    description={badge.description}
                    icon={badge.icon}
                    unlocked={badge.unlocked}
                    unlockedAt={badge.unlockedAt}
                    progressPercent={badge.progressPercent}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* 3. Monthly Trajectory Chart */}
        <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-brown-950 font-display">
                Monthly Carbon Savings Trajectory
              </h3>
            </div>
            <span className="text-[11px] font-mono text-brown-500">kg CO₂ Avoided</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
            {monthlyChart.map((m: any, i: number) => (
              <div
                key={i}
                className="rounded-xl border border-cream-200 bg-cream-50/70 p-3.5 text-center space-y-1.5"
              >
                <span className="text-[10px] text-brown-500 font-bold uppercase block">
                  {m.month}
                </span>
                <strong className="text-base font-black text-emerald-700 font-display block">
                  {m.co2SavedKg}kg
                </strong>
                <div className="h-1.5 w-full rounded-full bg-cream-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${Math.min(100, (m.co2SavedKg / 60) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 4. Device Contribution List */}
        {deviceContributions.length > 0 && (
          <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
            <h3 className="text-sm font-bold text-brown-950 font-display border-b border-cream-200 pb-3">
              Device-by-Device Contribution Log
            </h3>

            <div className="divide-y divide-cream-200">
              {deviceContributions.map((d: any, idx: number) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-brown-950 text-sm font-display">
                      {d.deviceTitle || `${d.brand} ${d.model}`}
                    </h5>
                    <p className="text-[10px] text-brown-500 font-mono">
                      Logged on {new Date(d.date).toLocaleDateString()} • Order Ref: {d.orderId}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="font-bold text-emerald-700 text-sm font-display block">
                        -{d.co2SavedKg}kg CO₂
                      </span>
                      <span className="text-[10px] text-brown-500">
                        {d.treesEquivalent} Trees • {d.waterLiters}L Water
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
