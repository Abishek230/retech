"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ImpactCounterProps {
  label: string;
  value: number;
  unit: string;
  subtext?: string;
  icon: React.ReactNode;
  variant?: "emerald" | "burgundy" | "brown" | "amber";
}

export function ImpactCounter({
  label,
  value,
  unit,
  subtext,
  icon,
  variant = "emerald",
}: ImpactCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = value / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(start * 10) / 10);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  const colorStyles = {
    emerald: "border-emerald-200 bg-emerald-50/50 text-emerald-950",
    burgundy: "border-burgundy/20 bg-burgundy/5 text-burgundy",
    brown: "border-brown-200 bg-cream-50 text-brown-900",
    amber: "border-amber-200 bg-amber-50/50 text-amber-950",
  };

  const iconStyles = {
    emerald: "bg-emerald-100 text-emerald-700",
    burgundy: "bg-burgundy/10 text-burgundy",
    brown: "bg-cream-200 text-brown-800",
    amber: "bg-amber-100 text-amber-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-5 shadow-sm space-y-3 transition-all ${colorStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-brown-500 font-display">
          {label}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconStyles[variant]}`}>
          {icon}
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-3xl font-black font-display tracking-tight">
            {displayValue.toLocaleString()}
          </span>
          <span className="text-sm font-bold text-brown-600 font-display">{unit}</span>
        </div>
        {subtext && <p className="text-[11px] text-brown-500 mt-1">{subtext}</p>}
      </div>
    </motion.div>
  );
}
