"use client";

import React from "react";
import { Leaf, Award, ShieldCheck } from "lucide-react";

interface EcoMeterProps {
  currentCO2: number;
  nextTierCO2?: number;
  currentLevelName?: string;
  nextLevelName?: string;
}

export function EcoMeter({
  currentCO2,
  nextTierCO2 = 200,
  currentLevelName = "Green Starter",
  nextLevelName = "Eco Warrior",
}: EcoMeterProps) {
  const percent = Math.min(100, Math.round((currentCO2 / nextTierCO2) * 100));

  return (
    <div className="rounded-2xl border border-cream-300 bg-white p-6 shadow-warm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-brown-950 font-display">
              Circular Eco Rank: <span className="text-emerald-700">{currentLevelName}</span>
            </h4>
            <p className="text-[11px] text-brown-500">
              {nextTierCO2 - currentCO2 > 0
                ? `${(nextTierCO2 - currentCO2).toFixed(1)}kg CO₂ to ${nextLevelName}`
                : "Max Tier Reached"}
            </p>
          </div>
        </div>

        <span className="font-mono text-xs font-bold text-brown-800 bg-cream-100 px-2.5 py-1 rounded-lg">
          {percent}%
        </span>
      </div>

      <div className="h-3 w-full rounded-full bg-cream-200 overflow-hidden p-0.5 border border-cream-300">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-burgundy transition-all duration-1000"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[10px] font-bold text-brown-500 uppercase tracking-wider">
        <span>0kg CO₂</span>
        <span>{nextTierCO2}kg Target</span>
      </div>
    </div>
  );
}
