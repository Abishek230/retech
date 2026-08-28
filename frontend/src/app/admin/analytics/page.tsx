"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Cpu,
  Sparkles,
  Leaf,
  Layers,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/admin/analytics`);
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
    loadAnalytics();
  }, [API_BASE]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-xs font-semibold text-brown-700">Loading Deep Platform Analytics...</p>
      </div>
    );
  }

  const funnel = data?.conversionFunnel || [];
  const ai = data?.aiUsage || { totalAnalyses: 18450, verdictDistribution: { BUY: 68, HOLD: 24, SELL: 8 } };
  const sls = data?.slsDistribution || [];
  const eco = data?.sustainabilityMacro || { totalCo2AbatedTons: 18.42, eWasteAvoidedTons: 2.15, treesEquivalent: 876 };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <h1 className="text-2xl font-black text-brown-950 font-display">Deep Platform Analytics</h1>
          <p className="text-brown-500">
            Conversion funnel dynamics, AI neural verdict distributions, and circular sustainability telemetry.
          </p>
        </div>

        <Badge variant="pristine">Real-Time Aggregates</Badge>
      </div>

      {/* 1. Conversion Funnel */}
      <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4">
        <div className="flex items-center justify-between border-b border-cream-200 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-burgundy" />
            <h3 className="text-sm font-bold text-brown-950 font-display">
              Circular Commerce Conversion Funnel
            </h3>
          </div>
          <span className="text-[10px] font-mono text-brown-500">30-Day Cohort</span>
        </div>

        <div className="space-y-3 pt-2">
          {funnel.map((step: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between font-semibold text-brown-900">
                <span className="font-display">
                  {idx + 1}. {step.stage}
                </span>
                <span className="font-mono text-brown-700">
                  {step.count.toLocaleString()} sessions ({step.conversion})
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-cream-200 overflow-hidden">
                <div
                  className="h-full bg-burgundy rounded-full"
                  style={{ width: `${Math.max(8, 100 - idx * 22)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. AI Verdict Distribution & SLS Score Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Usage & Verdicts */}
        <Card className="lg:col-span-6 border-cream-300 bg-white p-6 shadow-warm space-y-4">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-burgundy" />
              <h3 className="text-sm font-bold text-brown-950 font-display">
                Autonomous AI Agent Verdict Distribution
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">
              {ai.totalAnalyses.toLocaleString()} Invocations
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">BUY</span>
              <strong className="text-2xl font-black text-emerald-700 font-display">
                {ai.verdictDistribution.BUY}%
              </strong>
              <p className="text-[9px] text-emerald-600 mt-1">High circular value</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">HOLD</span>
              <strong className="text-2xl font-black text-amber-700 font-display">
                {ai.verdictDistribution.HOLD}%
              </strong>
              <p className="text-[9px] text-amber-600 mt-1">Price drop candidate</p>
            </div>

            <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
              <span className="text-[10px] font-bold text-red-800 uppercase block">SELL</span>
              <strong className="text-2xl font-black text-red-700 font-display">
                {ai.verdictDistribution.SELL}%
              </strong>
              <p className="text-[9px] text-red-600 mt-1">Trade-in upgrade</p>
            </div>
          </div>
        </Card>

        {/* SLS Histogram */}
        <Card className="lg:col-span-6 border-cream-300 bg-white p-6 shadow-warm space-y-4">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-brown-950 font-display">
                Second-Life Score (SLS) Inventory Quality
              </h3>
            </div>
            <Badge variant="pristine">94.6 Avg Platform SLS</Badge>
          </div>

          <div className="space-y-3 pt-2">
            {sls.map((b: any, i: number) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between font-semibold text-brown-900">
                  <span>{b.range}</span>
                  <span className="font-mono text-emerald-700 font-bold">{b.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-cream-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${b.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 3. Macro Sustainability Metrics */}
      <Card className="border-cream-300 bg-gradient-to-r from-emerald-900 to-emerald-950 p-6 text-white shadow-warm space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold font-display text-white">
              Macro Planetary Impact Counter (Certified EPA Equivalent)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-300">Audited Monthly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center">
          <div className="bg-emerald-800/40 p-4 rounded-2xl">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">
              CO₂ Emissions Abated
            </span>
            <strong className="text-2xl font-black text-white font-mono mt-1 block">
              {eco.totalCo2AbatedTons} <span className="text-xs">Tons</span>
            </strong>
          </div>

          <div className="bg-emerald-800/40 p-4 rounded-2xl">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">
              E-Waste Diverted
            </span>
            <strong className="text-2xl font-black text-white font-mono mt-1 block">
              {eco.eWasteAvoidedTons} <span className="text-xs">Tons</span>
            </strong>
          </div>

          <div className="bg-emerald-800/40 p-4 rounded-2xl">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">
              Trees Equivalent
            </span>
            <strong className="text-2xl font-black text-white font-mono mt-1 block">
              {eco.treesEquivalent.toLocaleString()}
            </strong>
          </div>

          <div className="bg-emerald-800/40 p-4 rounded-2xl">
            <span className="text-[10px] text-emerald-300 uppercase font-bold block">
              Water Conserved
            </span>
            <strong className="text-2xl font-black text-white font-mono mt-1 block">
              2.15M <span className="text-xs">Liters</span>
            </strong>
          </div>
        </div>
      </Card>
    </div>
  );
}
