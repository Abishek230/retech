"use client";

import React from "react";
import { Badge } from "../ui/Badge";
import {
  Wrench,
  Users,
  Search,
  ShieldCheck,
  RotateCcw,
  CheckCircle,
  Calendar,
  Lock,
  Sparkles,
} from "lucide-react";

interface PassportEntryItem {
  id: string;
  type: "REPAIR" | "OWNERSHIP" | "INSPECTION" | "CERTIFICATION" | "FACTORY_RESET";
  description: string;
  date: string;
  verifiedBy: string;
}

interface PassportTimelineProps {
  entries: PassportEntryItem[];
}

export function PassportTimeline({ entries = [] }: PassportTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "REPAIR":
        return <Wrench className="h-4 w-4 text-amber-700" />;
      case "OWNERSHIP":
        return <Users className="h-4 w-4 text-brown-800" />;
      case "INSPECTION":
        return <Search className="h-4 w-4 text-burgundy" />;
      case "CERTIFICATION":
        return <ShieldCheck className="h-4 w-4 text-emerald-700" />;
      case "FACTORY_RESET":
        return <Lock className="h-4 w-4 text-teal-700" />;
      default:
        return <CheckCircle className="h-4 w-4 text-brown-700" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "CERTIFICATION":
        return "pristine";
      case "INSPECTION":
        return "burgundy";
      case "FACTORY_RESET":
        return "excellent";
      case "REPAIR":
        return "good";
      default:
        return "cream";
    }
  };

  const defaultEntries: PassportEntryItem[] = [
    {
      id: "e-3",
      type: "CERTIFICATION",
      description: "Issued 12-Month ReTech Certified Guarantee. Serial & IMEI recorded on permanent registry.",
      date: new Date().toISOString(),
      verifiedBy: "ReTech Quality Board (Lead Assessor)",
    },
    {
      id: "e-2",
      type: "INSPECTION",
      description: "42-Point AI Optical Sensor, Multi-touch Subpixel, and Thermal Dissipation checks verified.",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      verifiedBy: "Elena Rostova (Lead AI Assessor)",
    },
    {
      id: "e-1",
      type: "FACTORY_RESET",
      description: "Cryptographic DoD 5220.22-M 3-Pass data sanitize completed. Zero residual sectors.",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      verifiedBy: "ReTech Automated Sanitation Engine",
    },
  ];

  const activeEntries = entries.length > 0 ? entries : defaultEntries;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <div>
          <h3 className="text-lg font-bold text-brown-950 font-display">
            Chronological Lifecycle Events
          </h3>
          <p className="text-xs text-brown-600">
            Immutable log of hardware servicing, audits, data sanitization, and verified ownership transfers.
          </p>
        </div>
        <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-bold text-brown-800">
          {activeEntries.length} Recorded Events
        </span>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-burgundy/20 space-y-8 my-4 ml-2">
        {activeEntries.map((entry, index) => {
          const entryDate = new Date(entry.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <div key={entry.id || index} className="relative group">
              {/* Dot Icon Anchor */}
              <div className="absolute -left-[35px] sm:-left-[43px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-cream-300 shadow-sm group-hover:scale-110 group-hover:border-burgundy transition-transform">
                {getIcon(entry.type)}
              </div>

              {/* Event Content Card */}
              <div className="rounded-2xl border border-cream-300 bg-white p-4 sm:p-5 shadow-sm space-y-2 hover:shadow-warm transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(entry.type) as any} className="text-[10px] font-bold">
                      {entry.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs font-bold text-brown-900 font-display">
                      Verified Lifecycle Event
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-brown-500 font-mono">
                    <Calendar className="h-3 w-3" />
                    <span>{entryDate}</span>
                  </div>
                </div>

                <p className="text-xs text-brown-700 leading-relaxed pt-1">
                  {entry.description}
                </p>

                <div className="border-t border-cream-100 pt-2 flex items-center justify-between text-[11px]">
                  <span className="text-brown-500">
                    Technician Signature: <strong className="text-brown-800">{entry.verifiedBy}</strong>
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Digitally Sealed
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
