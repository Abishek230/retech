"use client";

import React, { useState } from "react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  ChevronRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { AgentLiveStreamModal } from "./AgentLiveStreamModal";

interface AgentDecisionCardProps {
  deviceId: string;
  initialDecision?: {
    recommendation: "BUY" | "SELL" | "HOLD";
    confidence: number;
    reasoning?: string;
    keyFactors?: string[];
    riskFlags?: string[];
  };
  deviceTitle?: string;
}

export function AgentDecisionCard({
  deviceId,
  initialDecision,
  deviceTitle = "Refurbished Device",
}: AgentDecisionCardProps) {
  const [decision, setDecision] = useState(initialDecision || {
    recommendation: "BUY" as const,
    confidence: 96,
    reasoning: "Device passed 42-point AI automated diagnostics with optimal battery resistance, certified DoD data wipe, and zero thermal throttling.",
    keyFactors: [
      "Exceptional Component Health: 96% battery retention with pristine display array.",
      "High Economic Value: Priced at optimal circular fair market valuation.",
      "Verified Trust & Security: DoD 5220.22-M data wipe verified with Tier-1 seller rating (5.0/5.0).",
    ],
    riskFlags: [],
  });

  const [isLiveStreamOpen, setIsLiveStreamOpen] = useState(false);

  const rec = decision.recommendation;
  const conf = Math.round(decision.confidence <= 1 ? decision.confidence * 100 : decision.confidence);

  return (
    <>
      <Card className="border-cream-300 bg-gradient-to-br from-white via-cream-50/50 to-white p-6 shadow-warm space-y-5">
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy text-white shadow-sm">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-brown-950 font-display">
                  Autonomous AI Decision Agent
                </h3>
                <span className="rounded bg-burgundy/10 px-1.5 py-0.5 text-[9px] font-black text-burgundy tracking-wider uppercase">
                  Goal-to-Decision Loop
                </span>
              </div>
              <p className="text-xs text-brown-500">
                Cognitive synthesis across component telemetry, fair valuation & repair risk.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsLiveStreamOpen(true)}
            rightIcon={<Zap className="h-3.5 w-3.5" />}
          >
            Live Diagnostic Run
          </Button>
        </div>

        {/* Decision & Confidence Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          {/* Recommendation Banner */}
          <div className="sm:col-span-8 rounded-2xl border border-cream-200 bg-white p-4 shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brown-400 block mb-1">
                Final Agent Recommendation
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`text-3xl font-black font-display tracking-tight ${
                    rec === "BUY" ? "text-emerald-700" : rec === "SELL" ? "text-brown-800" : "text-amber-700"
                  }`}
                >
                  {rec === "BUY" ? "BUY (Strong Value)" : rec === "SELL" ? "SELL (Peak Liquidity)" : "HOLD (Further Audit)"}
                </span>
              </div>
              <p className="text-xs text-brown-600 mt-1 leading-relaxed line-clamp-2">
                {decision.reasoning}
              </p>
            </div>
          </div>

          {/* Confidence Ring */}
          <div className="sm:col-span-4 rounded-2xl border border-cream-200 bg-cream-100/60 p-4 text-center flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brown-500">
              Confidence Index
            </span>
            <div className="text-3xl font-black text-burgundy font-display my-1">
              {conf}%
            </div>
            <div className="w-full bg-cream-300 h-1.5 rounded-full overflow-hidden">
              <div className="bg-burgundy h-full rounded-full" style={{ width: `${conf}%` }} />
            </div>
          </div>
        </div>

        {/* 3 Key Factors */}
        {decision.keyFactors && decision.keyFactors.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brown-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Key Decision Drivers
            </span>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {decision.keyFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-cream-200 bg-white p-3 text-brown-700 flex items-start gap-2 shadow-sm"
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cream-100 text-burgundy font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="leading-snug">{factor}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Flags if any */}
        {decision.riskFlags && decision.riskFlags.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-700" />
              <span>Identified Risk Vectors:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
              {decision.riskFlags.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Live Stream Agent Modal */}
      <AgentLiveStreamModal
        isOpen={isLiveStreamOpen}
        onClose={() => setIsLiveStreamOpen(false)}
        deviceId={deviceId}
        deviceTitle={deviceTitle}
        onDecisionGenerated={(newDecision) => setDecision(newDecision)}
      />
    </>
  );
}
