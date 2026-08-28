"use client";

import React, { useState } from "react";
import { getCompleteProductSpecs, DetailedSpecs } from "@/lib/productSpecs";
import {
  Cpu,
  HardDrive,
  Monitor,
  BatteryCharging,
  Wifi,
  ShieldCheck,
  Camera,
  Calendar,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface ProductSpecsProps {
  device: any;
  listing?: any;
  variant?: "card" | "detailed" | "modal";
  compact?: boolean;
}

export function ProductSpecsCompact({ device, listing }: ProductSpecsProps) {
  const specs = getCompleteProductSpecs(device, listing);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pt-2 border-t border-cream-200/80">
      {/* Compact 2x2 / 2x3 Grid */}
      <div className="grid grid-cols-2 gap-1.5 text-[11px] text-brown-700">
        {/* Processor */}
        <div className="flex items-start gap-1 rounded-md bg-cream-50/80 p-1.5 border border-cream-200/60">
          <Cpu className="h-3 w-3 text-burgundy shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[9px] text-brown-400 font-bold block uppercase tracking-wider">CPU</span>
            <span className="font-semibold text-brown-900 truncate block text-[10px]" title={specs.processor}>
              {specs.processor.split("(")[0].trim()}
            </span>
          </div>
        </div>

        {/* RAM & Storage */}
        <div className="flex items-start gap-1 rounded-md bg-cream-50/80 p-1.5 border border-cream-200/60">
          <HardDrive className="h-3 w-3 text-emerald-700 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[9px] text-brown-400 font-bold block uppercase tracking-wider">RAM / ROM</span>
            <span className="font-semibold text-brown-900 truncate block text-[10px]">
              {specs.ram !== "Optimized RAM" ? `${specs.ram} • ${specs.storage}` : specs.storage}
            </span>
          </div>
        </div>

        {/* Display / Screen */}
        <div className="flex items-start gap-1 rounded-md bg-cream-50/80 p-1.5 border border-cream-200/60">
          <Monitor className="h-3 w-3 text-blue-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[9px] text-brown-400 font-bold block uppercase tracking-wider">Display</span>
            <span className="font-semibold text-brown-900 truncate block text-[10px]" title={specs.display}>
              {specs.display.split("(")[0].trim()}
            </span>
          </div>
        </div>

        {/* Battery & Health */}
        <div className="flex items-start gap-1 rounded-md bg-cream-50/80 p-1.5 border border-cream-200/60">
          <BatteryCharging className="h-3 w-3 text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <span className="text-[9px] text-brown-400 font-bold block uppercase tracking-wider">Battery</span>
            <span className="font-semibold text-brown-900 truncate block text-[10px]" title={specs.battery}>
              {specs.battery.split("(")[0].trim()}
            </span>
          </div>
        </div>
      </div>

      {/* Toggle Complete Specs Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full mt-2 py-1 text-[10px] font-bold text-burgundy flex items-center justify-center gap-1 hover:underline cursor-pointer bg-burgundy/5 rounded-md transition-colors"
      >
        <Sparkles className="h-2.5 w-2.5 text-burgundy" />
        {isOpen ? "Hide Full Specs" : "View Full Product Specs"}
        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      {/* Expanded Quick Specs Drawer */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-2 space-y-1 rounded-lg border border-cream-300 bg-cream-100/70 p-2 text-[10px] text-brown-800 animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <div className="flex justify-between border-b border-cream-200 pb-1 font-bold text-brown-950">
            <span>Detailed Hardware</span>
            <span className="text-burgundy font-mono">{device?.brand} {device?.year}</span>
          </div>
          <div className="grid grid-cols-1 gap-1 pt-1">
            <div>
              <span className="text-brown-500 font-bold">Camera: </span>
              <span>{specs.camera}</span>
            </div>
            <div>
              <span className="text-brown-500 font-bold">Connectivity: </span>
              <span>{specs.connectivity}</span>
            </div>
            <div>
              <span className="text-brown-500 font-bold">OS & Security: </span>
              <span>{specs.os}</span>
            </div>
            <div>
              <span className="text-brown-500 font-bold">Warranty: </span>
              <span className="text-emerald-700 font-bold">{specs.warranty}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ProductSpecsDetailed({ device, listing }: ProductSpecsProps) {
  const specs = getCompleteProductSpecs(device, listing);

  const categories = ["Performance", "Display", "Camera & Audio", "Battery & Power", "Connectivity", "Guarantee"] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-cream-300 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-burgundy/10 text-burgundy font-bold">
            <Cpu className="h-4 w-4" />
          </div>
          <h3 className="text-base font-black text-brown-950 font-display">
            Complete Technical Specifications
          </h3>
        </div>
        <Badge variant="pristine" className="text-xs font-bold">
          42-Point AI Verified
        </Badge>
      </div>

      {/* Grid of Spec Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((catName) => {
          const itemsInCat = specs.allSpecs.filter((s) => s.category === catName);
          if (itemsInCat.length === 0) return null;

          return (
            <div
              key={catName}
              className="rounded-xl border border-cream-200 bg-white p-3.5 shadow-xs space-y-2.5"
            >
              <h4 className="text-xs font-bold uppercase tracking-wider text-brown-400 font-display border-b border-cream-100 pb-1">
                {catName}
              </h4>
              <div className="space-y-2">
                {itemsInCat.map((spec, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs gap-3">
                    <span className="text-brown-500 shrink-0 font-medium">{spec.label}</span>
                    <span className="font-semibold text-brown-950 text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
