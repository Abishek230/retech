"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import {
  ShieldCheck,
  Calendar,
  Users,
  Cpu,
  Leaf,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

interface PassportSummaryProps {
  passport: any;
}

export function PassportSummary({ passport }: PassportSummaryProps) {
  const device = passport?.device || {};
  const score = device?.secondLifeScores?.[0]?.score || 96.5;
  const sustainability = device?.sustainabilityRecords?.[0];
  const isVerified = !!passport?.verifiedAt;

  // Calculate approximate age
  const originalYear = device?.year || 2023;
  const currentYear = new Date().getFullYear();
  const ageYears = Math.max(1, currentYear - originalYear);

  const images = device?.listings?.[0]?.images || [
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
  ];

  return (
    <Card className="border-cream-300 bg-white p-6 shadow-warm overflow-hidden">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Device Image Box */}
        <div className="md:col-span-4 relative h-52 md:h-full min-h-[200px] rounded-2xl overflow-hidden border border-cream-200 bg-cream-100/50">
          <Image
            src={images[0]}
            alt={device?.model || "Device"}
            fill
            className="object-contain p-3"
          />
          <div className="absolute top-2 left-2">
            <Badge variant={isVerified ? "pristine" : "brown"}>
              {isVerified ? "Certified Authentic" : "Inspection Pending"}
            </Badge>
          </div>
        </div>

        {/* Specifications & Metrics */}
        <div className="md:col-span-8 space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-brown-500 uppercase tracking-wider text-[11px]">
                {device?.brand} • {device?.year} Edition
              </span>
              <span className="font-mono text-[11px] text-brown-400">
                IMEI: {device?.imei || "359123456789012"}
              </span>
            </div>
            <h2 className="text-2xl font-black text-brown-950 font-display mt-0.5">
              {device?.brand} {device?.model}
            </h2>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-2.5">
              <span className="text-brown-500 block text-[10px]">Storage</span>
              <strong className="text-brown-900">{device?.storage || "256GB"}</strong>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-2.5">
              <span className="text-brown-500 block text-[10px]">Memory</span>
              <strong className="text-brown-900">{device?.ram || "8GB RAM"}</strong>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-2.5">
              <span className="text-brown-500 block text-[10px]">Color</span>
              <strong className="text-brown-900">{device?.color || "Space Gray"}</strong>
            </div>
            <div className="rounded-xl border border-cream-200 bg-cream-50 p-2.5">
              <span className="text-brown-500 block text-[10px]">Device Lifespan</span>
              <strong className="text-brown-900">{ageYears} Year{ageYears > 1 ? "s" : ""} Active</strong>
            </div>
          </div>

          {/* Lifecycle Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="rounded-xl border border-cream-300 bg-gradient-to-r from-cream-100 to-cream-50 p-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-burgundy text-white shrink-0">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <span className="text-brown-500 block text-[10px]">Second-Life Score</span>
                <strong className="text-burgundy text-sm font-black font-display">{score} / 100</strong>
              </div>
            </div>

            <div className="rounded-xl border border-cream-300 bg-gradient-to-r from-cream-100 to-cream-50 p-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brown-700 text-white shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <span className="text-brown-500 block text-[10px]">Previous Owners</span>
                <strong className="text-brown-900 text-sm font-black font-display">
                  {passport?.previousOwners || 1} Verified Owner
                </strong>
              </div>
            </div>

            <div className="rounded-xl border border-cream-300 bg-gradient-to-r from-cream-100 to-cream-50 p-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white shrink-0">
                <Leaf className="h-4 w-4" />
              </div>
              <div>
                <span className="text-brown-500 block text-[10px]">Carbon Impact</span>
                <strong className="text-emerald-800 text-sm font-black font-display">
                  -{sustainability?.co2SavedKg || 58.4}kg CO₂
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
