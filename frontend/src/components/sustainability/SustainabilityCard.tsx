"use client";

import React from "react";
import { Leaf, Droplets, Trash2, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";

interface SustainabilityCardProps {
  co2SavedKg: number;
  eWasteAvoidedKg: number;
  treesEquivalent: number;
  waterLiters: number;
  deviceTitle?: string;
}

export function SustainabilityCard({
  co2SavedKg,
  eWasteAvoidedKg,
  treesEquivalent,
  waterLiters,
  deviceTitle,
}: SustainabilityCardProps) {
  return (
    <Card className="border-cream-300 bg-gradient-to-br from-white via-cream-50/50 to-white p-6 shadow-warm space-y-4">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Leaf className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-brown-950 font-display">
              Circular Impact Assessment
            </h4>
            {deviceTitle && <p className="text-[10px] text-brown-500">{deviceTitle}</p>}
          </div>
        </div>

        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
          Lifecycle Verified
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="rounded-xl border border-cream-200 bg-white p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brown-400 block">CO₂ Saved</span>
          <strong className="text-base font-black text-emerald-700 font-display">
            -{co2SavedKg}kg
          </strong>
        </div>

        <div className="rounded-xl border border-cream-200 bg-white p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brown-400 block">E-Waste Diverted</span>
          <strong className="text-base font-black text-brown-900 font-display">
            -{eWasteAvoidedKg}kg
          </strong>
        </div>

        <div className="rounded-xl border border-cream-200 bg-white p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brown-400 block">Trees Eq.</span>
          <strong className="text-base font-black text-emerald-700 font-display">
            {treesEquivalent} 🌲
          </strong>
        </div>

        <div className="rounded-xl border border-cream-200 bg-white p-3 space-y-1">
          <span className="text-[10px] uppercase font-bold text-brown-400 block">Water Saved</span>
          <strong className="text-base font-black text-sky-700 font-display">
            {waterLiters}L
          </strong>
        </div>
      </div>
    </Card>
  );
}
