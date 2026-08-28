"use client";

import React from "react";
import { Award, Lock, CheckCircle2 } from "lucide-react";

interface ImpactBadgeProps {
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progressPercent?: number;
}

export function ImpactBadge({
  name,
  description,
  icon,
  unlocked,
  unlockedAt,
  progressPercent = 0,
}: ImpactBadgeProps) {
  return (
    <div
      className={`rounded-2xl border p-4 text-xs transition-all space-y-3 ${
        unlocked
          ? "border-emerald-300 bg-gradient-to-br from-white via-emerald-50/40 to-white shadow-sm"
          : "border-cream-200 bg-cream-50/60 opacity-60 grayscale-[40%]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl shadow-sm ${
              unlocked ? "bg-emerald-100 ring-2 ring-emerald-300" : "bg-cream-200 text-brown-400"
            }`}
          >
            {icon}
          </div>
          <div>
            <h5 className="font-bold text-brown-950 font-display text-sm">{name}</h5>
            <span className="text-[10px] text-brown-500 block">
              {unlocked ? "Unlocked Badge ✓" : `${progressPercent}% Progress`}
            </span>
          </div>
        </div>

        {unlocked ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        ) : (
          <Lock className="h-3.5 w-3.5 text-brown-400" />
        )}
      </div>

      <p className="text-brown-600 text-[11px] leading-relaxed">{description}</p>

      {!unlocked && (
        <div className="h-1.5 w-full rounded-full bg-cream-200 overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
