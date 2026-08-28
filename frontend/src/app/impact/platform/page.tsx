"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ImpactCounter } from "@/components/sustainability/ImpactCounter";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Globe,
  Leaf,
  Trash2,
  TreeDeciduous,
  Droplets,
  Car,
  Home,
  Trophy,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  MapPin,
  Loader2,
  ShieldCheck,
} from "lucide-react";

export default function PlatformImpactPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    async function loadPlatform() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/sustainability/platform`);
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
    loadPlatform();
  }, [API_BASE]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-sm font-semibold text-brown-700">
          Aggregating Global Circular Intelligence...
        </p>
      </div>
    );
  }

  const totals = data?.totals || {
    totalCO2Kg: 48520.4,
    totalCO2Tons: 48.5,
    totalEWasteKg: 3420.8,
    totalTreesEquivalent: 2310.5,
    totalWaterLiters: 284000,
    carMilesEquivalent: 118874,
    homesPoweredAnnual: 6.7,
  };

  const monthlyChart = data?.monthlyChart || [];
  const regionalImpact = data?.regionalImpact || [];
  const leaderboard = data?.leaderboard || [];

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Top Banner */}
      <div className="border-b border-cream-200 bg-white/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="burgundy" dot>
                Global Circular Ledger
              </Badge>
              <span className="text-xs text-brown-500 font-semibold">
                Network-Wide Material Avoidance
              </span>
            </div>
            <h1 className="text-3xl font-black text-brown-950 font-display">
              Global Platform Impact
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Link href="/impact">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                My Personal Impact
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* 1. Global Macro Impact Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ImpactCounter
            label="Total Carbon Diverted"
            value={totals.totalCO2Tons}
            unit="Metric Tons"
            subtext={`${totals.totalCO2Kg.toLocaleString()}kg verified emissions offset.`}
            icon={<Leaf className="h-5 w-5" />}
            variant="emerald"
          />

          <ImpactCounter
            label="E-Waste Diverted"
            value={totals.totalEWasteKg}
            unit="kg Diverted"
            subtext="Heavy metals prevented from ground disposal."
            icon={<Trash2 className="h-5 w-5" />}
            variant="brown"
          />

          <ImpactCounter
            label="Urban Tree Equivalent"
            value={totals.totalTreesEquivalent}
            unit="Trees / Year"
            subtext="Annual sequestering capacity equivalent."
            icon={<TreeDeciduous className="h-5 w-5" />}
            variant="emerald"
          />

          <ImpactCounter
            label="Water Conserved"
            value={totals.totalWaterLiters}
            unit="Liters"
            subtext="Direct extraction water avoided."
            icon={<Droplets className="h-5 w-5" />}
            variant="amber"
          />
        </div>

        {/* 2. Real-World Equivalents Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="border-cream-300 bg-gradient-to-br from-white via-emerald-50/50 to-white p-6 shadow-warm space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Car className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-brown-500 block">
                  Passenger Vehicle Avoidance
                </span>
                <strong className="text-xl font-black text-brown-950 font-display">
                  {totals.carMilesEquivalent.toLocaleString()} Gasoline Miles
                </strong>
              </div>
            </div>
            <p className="text-xs text-brown-600 pt-1">
              Equivalent to taking 26 passenger combustion vehicles off the road for an entire year.
            </p>
          </Card>

          <Card className="border-cream-300 bg-gradient-to-br from-white via-amber-50/50 to-white p-6 shadow-warm space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Home className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-brown-500 block">
                  Residential Energy Avoidance
                </span>
                <strong className="text-xl font-black text-brown-950 font-display">
                  {totals.homesPoweredAnnual} Homes Powered / Year
                </strong>
              </div>
            </div>
            <p className="text-xs text-brown-600 pt-1">
              Electricity emissions saved across residential households using renewable circular hardware.
            </p>
          </Card>
        </div>

        {/* 3. Monthly Network Trajectory & Regional Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Monthly Trajectory */}
          <div className="lg:col-span-7">
            <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs h-full">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-700" />
                  <h3 className="text-sm font-bold text-brown-950 font-display">
                    Network Monthly Carbon Trajectory
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-brown-500">Metric Tons</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2">
                {monthlyChart.map((m: any, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-cream-200 bg-cream-50/70 p-3 text-center space-y-1.5"
                  >
                    <span className="text-[10px] text-brown-500 font-bold uppercase block">
                      {m.month}
                    </span>
                    <strong className="text-sm font-black text-emerald-700 font-display block">
                      {m.co2Tons}T
                    </strong>
                    <span className="text-[9px] text-brown-400 block font-mono">
                      {m.eWasteKg}kg e-waste
                    </span>
                    <div className="h-1.5 w-full rounded-full bg-cream-200 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full"
                        style={{ width: `${Math.min(100, (m.co2Tons / 12) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Regional Distribution & World Map */}
          <div className="lg:col-span-5">
            <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs h-full">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-burgundy" />
                  <h3 className="text-sm font-bold text-brown-950 font-display">
                    World Impact Map & Regional Share
                  </h3>
                </div>
                <Badge variant="pristine" className="text-[9px] py-0 px-1.5">
                  Live Global Nodes
                </Badge>
              </div>

              {/* Stylized SVG World Map */}
              <div className="relative rounded-2xl border border-cream-200 bg-cream-50/70 p-3 flex flex-col items-center justify-center">
                <svg
                  viewBox="0 0 400 180"
                  className="w-full h-auto text-cream-300 opacity-90"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Stylized Continents Outlines */}
                  <path
                    d="M 60,40 Q 90,30 110,60 Q 130,80 120,110 Q 100,130 70,120 Q 50,90 60,40 Z"
                    fill="#E5DDD0"
                  />
                  <path
                    d="M 120,115 Q 140,115 150,140 Q 140,170 120,165 Q 105,145 120,115 Z"
                    fill="#E5DDD0"
                  />
                  <path
                    d="M 190,35 Q 230,30 245,55 Q 230,85 200,80 Q 185,60 190,35 Z"
                    fill="#E5DDD0"
                  />
                  <path
                    d="M 200,85 Q 240,85 240,130 Q 210,150 195,120 Q 190,95 200,85 Z"
                    fill="#E5DDD0"
                  />
                  <path
                    d="M 255,40 Q 340,30 360,75 Q 330,110 275,95 Q 250,70 255,40 Z"
                    fill="#E5DDD0"
                  />
                  <path
                    d="M 310,120 Q 350,120 345,150 Q 320,160 305,140 Z"
                    fill="#E5DDD0"
                  />

                  {/* Pulsing Regional Nodes */}
                  {/* North America Node */}
                  <circle cx="85" cy="65" r="7" fill="#641F2A" opacity="0.3" className="animate-ping" />
                  <circle cx="85" cy="65" r="4" fill="#641F2A" />

                  {/* Europe Node */}
                  <circle cx="215" cy="55" r="7" fill="#047857" opacity="0.3" className="animate-ping" />
                  <circle cx="215" cy="55" r="4" fill="#047857" />

                  {/* Asia Pacific Node */}
                  <circle cx="310" cy="75" r="7" fill="#8A6652" opacity="0.3" className="animate-ping" />
                  <circle cx="310" cy="75" r="4" fill="#8A6652" />
                </svg>

                <div className="flex items-center gap-4 text-[10px] text-brown-600 font-semibold mt-1">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-burgundy" /> North America
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" /> Europe
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-brown-700" /> Asia Pacific
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {regionalImpact.map((r: any, idx: number) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="text-brown-900">{r.region}</span>
                      <span className="font-mono text-emerald-700 font-bold">
                        {r.co2Tons} Tons ({r.co2Percent}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
                      <div
                        className="h-full bg-burgundy rounded-full"
                        style={{ width: `${r.co2Percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* 4. Global Eco Leaderboard */}
        <Card className="border-cream-300 bg-white p-6 sm:p-8 shadow-warm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-cream-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-brown-950 font-display">
                  Global Eco Leaderboard
                </h3>
                <p className="text-[11px] text-brown-500">
                  Recognizing the top circular recyclers, refurbishers, and buyers
                </p>
              </div>
            </div>

            <Badge variant="pristine">Monthly Season 4</Badge>
          </div>

          <div className="divide-y divide-cream-200">
            {leaderboard.map((champ: any) => (
              <div
                key={champ.rank}
                className="py-3.5 flex items-center justify-between gap-4 hover:bg-cream-50/60 transition-colors px-2 rounded-xl"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full font-bold text-xs font-mono ${
                      champ.rank === 1
                        ? "bg-amber-100 text-amber-800 ring-2 ring-amber-300"
                        : champ.rank === 2
                        ? "bg-slate-100 text-slate-700 ring-1 ring-slate-300"
                        : champ.rank === 3
                        ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                        : "bg-cream-100 text-brown-600"
                    }`}
                  >
                    #{champ.rank}
                  </span>

                  <span className="text-xl">{champ.avatar}</span>

                  <div>
                    <h5 className="font-bold text-brown-950 font-display text-sm">
                      {champ.name}
                    </h5>
                    <span className="text-[10px] text-brown-500 font-mono">
                      {champ.devicesResold} Circular Transfers Completed
                    </span>
                  </div>
                </div>

                <div className="text-right flex items-center gap-4">
                  <div>
                    <span className="font-bold text-emerald-700 font-display text-sm block">
                      {champ.co2SavedKg}kg CO₂
                    </span>
                    <Badge variant="brown" className="text-[9px] py-0 px-1.5">
                      {champ.badge}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
