"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  Sparkles,
  Cpu,
  Target,
  ListOrdered,
  Zap,
  Brain,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Bookmark,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Loader2,
  Check,
  Terminal,
  Activity,
} from "lucide-react";

interface PlannedTool {
  id: string;
  name: string;
  target: string;
  status: "pending" | "running" | "complete";
  result?: string;
  executionTimeMs?: number;
}

interface AgentState {
  status: "IDLE" | "ANALYZING" | "COMPLETE" | "ERROR";
  goal: string;
  plan: PlannedTool[];
  activeToolIndex: number;
  reasoning: string;
  decision: {
    recommendation: "BUY" | "SELL" | "HOLD";
    confidence: number;
    keyFactors: string[];
    riskFlags: string[];
  } | null;
  logs: string[];
}

export default function AgentAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const deviceId = String(params.deviceId);

  const [deviceInfo, setDeviceInfo] = useState<{ brand: string; model: string; price: number }>({
    brand: "Apple",
    model: "MacBook Pro 14 M3 Pro",
    price: 1499,
  });

  const [agentState, setAgentState] = useState<AgentState>({
    status: "IDLE",
    goal: "",
    plan: [
      { id: "tool-1", name: "getSecondLifeScore", target: "Component health, battery capacity, thermals, optics", status: "pending" },
      { id: "tool-2", name: "getDigitalLifePassport", target: "DoD 5220.22-M data wipe audit, ownership logs, guarantee", status: "pending" },
      { id: "tool-3", name: "getMarketPriceRange", target: "Fair circular market valuation and price arbitrage margins", status: "pending" },
      { id: "tool-4", name: "getSellerRating", target: "Seller historical fulfillment reliability and verified trust grade", status: "pending" },
      { id: "tool-5", name: "getRepairRiskScore", target: "Modular repairability index and component obsolescence risk", status: "pending" },
      { id: "tool-6", name: "getSustainabilityImpact", target: "Carbon emissions avoided and diverted e-waste metrics", status: "pending" },
    ],
    activeToolIndex: 0,
    reasoning: "",
    decision: null,
    logs: [],
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

  // Fetch device details on mount
  useEffect(() => {
    async function loadDevice() {
      try {
        const res = await fetch(`${API_BASE}/listings/${deviceId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.data?.device) {
            setDeviceInfo({
              brand: data.data.device.brand,
              model: data.data.device.model,
              price: data.data.price || 1299,
            });
          }
        }
      } catch {
        // Fallback defaults
      }
    }
    if (deviceId) {
      loadDevice();
    }
  }, [deviceId, API_BASE]);

  // Establish WebSocket connection
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("⚡ [Agent Socket] Connected to real-time intelligence stream");
      socket.emit("join_listing", deviceId);
    });

    socket.on(`agent:start:${deviceId}`, () => {
      setAgentState((prev) => ({
        ...prev,
        status: "ANALYZING",
        logs: [...prev.logs, "⚡ [SYSTEM] Intelligence session initialized."],
      }));
    });

    socket.on(`agent:goal:${deviceId}`, (data: any) => {
      setAgentState((prev) => ({
        ...prev,
        goal: data.goal || prev.goal,
        logs: [...prev.logs, `🎯 [GOAL] ${data.goal}`],
      }));
    });

    socket.on(`agent:tool_call:${deviceId}`, (data: any) => {
      setAgentState((prev) => {
        const newPlan = prev.plan.map((t) =>
          t.name === data.toolName ? { ...t, status: "running" as const } : t
        );
        return {
          ...prev,
          plan: newPlan,
          logs: [...prev.logs, `⚡ [TOOL CALL] ${data.toolName}(${deviceId}) — Running...`],
        };
      });
    });

    socket.on(`agent:tool_result:${deviceId}`, (data: any) => {
      setAgentState((prev) => {
        const newPlan = prev.plan.map((t) =>
          t.name === data.toolName
            ? { ...t, status: "complete" as const, result: data.result, executionTimeMs: data.executionTimeMs }
            : t
        );
        return {
          ...prev,
          plan: newPlan,
          logs: [...prev.logs, `✓ [TOOL RESULT] ${data.toolName} => ${data.result}`],
        };
      });
    });

    socket.on(`agent:reasoning:${deviceId}`, (data: any) => {
      setAgentState((prev) => ({
        ...prev,
        reasoning: data.reasoning,
        logs: [...prev.logs, "🧠 [REASONING] Multi-factor synthesis complete."],
      }));
    });

    socket.on(`agent:decision:${deviceId}`, (data: any) => {
      setAgentState((prev) => ({
        ...prev,
        status: "COMPLETE",
        decision: {
          recommendation: data.recommendation,
          confidence: data.confidence,
          keyFactors: data.keyFactors || [],
          riskFlags: data.riskFlags || [],
        },
        logs: [
          ...prev.logs,
          `🏆 [VERDICT] ${data.recommendation} (Confidence: ${data.confidence}%)`,
        ],
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [deviceId, SOCKET_URL]);

  // Execute Agent Analysis
  const handleStartAnalysis = async () => {
    try {
      setHasStarted(true);
      setErrorMessage(null);
      setAgentState((prev) => ({
        ...prev,
        status: "ANALYZING",
        goal: `Formulating comprehensive valuation and component integrity matrix for ${deviceInfo.brand} ${deviceInfo.model}...`,
        plan: prev.plan.map((t) => ({ ...t, status: "pending", result: undefined })),
        reasoning: "",
        decision: null,
        logs: [`[SYSTEM] Starting Agent analysis loop for ${deviceInfo.brand} ${deviceInfo.model}...`],
      }));

      const res = await fetch(`${API_BASE}/agent/analyze/${deviceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to complete autonomous AI analysis.");
      }

      const responseData = await res.json();
      const decision = responseData.data;

      // Ensure state is populated if WebSocket had latency
      setAgentState((prev) => ({
        ...prev,
        status: "COMPLETE",
        goal: decision.telemetry?.goal || prev.goal,
        plan: prev.plan.map((t) => ({
          ...t,
          status: "complete",
          result: t.result || "Verified Optimal",
        })),
        reasoning: decision.reasoning,
        decision: {
          recommendation: decision.recommendation,
          confidence: decision.confidence,
          keyFactors: decision.keyFactors,
          riskFlags: decision.riskFlags,
        },
      }));
    } catch (err: any) {
      setErrorMessage(err.message || "Agent execution failed");
      setAgentState((prev) => ({ ...prev, status: "ERROR" }));
    }
  };

  // Auto-start on first load
  useEffect(() => {
    if (!hasStarted && deviceId) {
      handleStartAnalysis();
    }
  }, [deviceId]);

  const decision = agentState.decision;
  const isAnalyzing = agentState.status === "ANALYZING";
  const isComplete = agentState.status === "COMPLETE";

  return (
    <div className="min-h-screen bg-cream-50 pb-28">
      {/* Top Header */}
      <div className="border-b border-cream-200 bg-white/80 py-4 backdrop-blur-sm sticky top-14 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href={`/listings/${deviceId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-burgundy"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Device
            </Link>
            <span className="text-cream-300">|</span>
            <Badge
              variant={isComplete ? "pristine" : isAnalyzing ? "burgundy" : "brown"}
              dot
            >
              {isComplete
                ? "Agent Analysis Complete"
                : isAnalyzing
                ? "Autonomous Agent Active"
                : "Idle Session"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleStartAnalysis}
              isLoading={isAnalyzing}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              {isAnalyzing ? "Processing..." : "Run New Analysis"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* 1. AGENT HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-cream-300 bg-gradient-to-br from-white via-cream-100/50 to-white p-6 sm:p-8 shadow-warm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* Animated AI Icon */}
              <motion.div
                animate={isAnalyzing ? { rotate: [0, 180, 360], scale: [1, 1.08, 1] } : {}}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-burgundy text-white shadow-warm shrink-0"
              >
                <Sparkles className="h-8 w-8 text-cream animate-pulse" />
              </motion.div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-widest text-burgundy font-display">
                    ReTech Intelligence Agent
                  </span>
                  <span className="text-[10px] bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full font-bold">
                    v2.4 Cognitive Engine
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-brown-950 font-display leading-tight">
                  {deviceInfo.brand} {deviceInfo.model}
                </h1>
                <p className="text-xs text-brown-600 mt-0.5">
                  Device Target: <span className="font-mono font-semibold">{deviceId}</span> • Market Benchmark: ${deviceInfo.price}
                </p>
              </div>
            </div>

            {/* Status Visual */}
            <div className="flex items-center gap-3 bg-white rounded-2xl border border-cream-200 p-3.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cream-100 text-burgundy">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div className="text-xs">
                <span className="text-brown-500 block text-[10px] uppercase font-bold">
                  Engine Status
                </span>
                <strong className="text-brown-950 font-bold">
                  {isAnalyzing ? "Executing Cognitive Loop..." : isComplete ? "Analysis Finalized" : "Ready"}
                </strong>
              </div>
            </div>
          </div>
        </motion.div>

        {errorMessage && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        {/* 2. GOAL PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-cream-300 bg-white p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brown-500 font-display">
              <Target className="h-4 w-4 text-burgundy" /> Stage 1: Active Goal Formulation
            </div>
            <p className="text-sm font-semibold text-brown-900 leading-relaxed font-display bg-cream-50/70 p-3.5 rounded-xl border border-cream-200">
              {agentState.goal || "Formulating goal objective..."}
            </p>
          </Card>
        </motion.div>

        {/* 3. PLAN PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-cream-300 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-cream-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brown-500 font-display">
                <ListOrdered className="h-4 w-4 text-brown-700" /> Stage 2: Diagnostic Tool Execution Plan
              </div>
              <span className="text-[11px] font-semibold text-brown-500 font-mono">
                6 Tools Coordinated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {agentState.plan.map((t, idx) => (
                <div
                  key={t.id}
                  className={`rounded-xl border p-3 text-xs space-y-1 transition-all ${
                    t.status === "complete"
                      ? "border-emerald-200 bg-emerald-50/50"
                      : t.status === "running"
                      ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy/20"
                      : "border-cream-200 bg-cream-50/50 opacity-70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-[11px] text-brown-900">
                      {idx + 1}. {t.name}()
                    </span>
                    {t.status === "complete" ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        ✓ Done
                      </span>
                    ) : t.status === "running" ? (
                      <span className="text-[10px] font-bold text-burgundy bg-burgundy/10 px-1.5 py-0.5 rounded animate-pulse">
                        ● Running
                      </span>
                    ) : (
                      <span className="text-[10px] text-brown-400">Queued</span>
                    )}
                  </div>
                  <p className="text-[11px] text-brown-600 line-clamp-2">{t.target}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 4. LIVE TOOL CALLS PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-cream-300 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-cream-100 pb-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brown-500 font-display">
                <Zap className="h-4 w-4 text-burgundy" /> Stage 3: Live Tool Invocations & Telemetry
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Synchronized
              </span>
            </div>

            <div className="space-y-2.5">
              {agentState.plan.map((tool) => (
                <div
                  key={tool.id}
                  className="rounded-xl border border-cream-200 bg-cream-50/60 p-3 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-burgundy text-xs">
                      {tool.name}({deviceId.slice(0, 8)}...)
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tool.status === "complete"
                          ? "bg-emerald-100 text-emerald-800"
                          : tool.status === "running"
                          ? "bg-burgundy/15 text-burgundy animate-pulse"
                          : "bg-cream-200 text-brown-600"
                      }`}
                    >
                      Status: {tool.status === "complete" ? "Complete" : tool.status === "running" ? "Running" : "Pending"}
                    </span>
                  </div>

                  {tool.result && (
                    <div className="rounded-lg bg-white border border-cream-200 p-2 font-mono text-[11px] text-brown-800">
                      <strong className="text-emerald-700">Result:</strong> {tool.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* 5. REASONING STREAM PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-cream-300 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brown-500 font-display">
              <Brain className="h-4 w-4 text-burgundy" /> Stage 4: Multi-Factor Bayesian Reasoning
            </div>
            <div className="rounded-2xl border border-cream-200 bg-gradient-to-r from-cream-50 to-white p-4 text-xs text-brown-800 leading-relaxed space-y-2">
              <p>{agentState.reasoning || "Synthesizing evidence across component degradation, seller reputation, and fair pricing..."}</p>
            </div>
          </Card>
        </motion.div>

        {/* 6. VERDICT CARD */}
        <AnimatePresence>
          {decision && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-2 border-burgundy/30 bg-gradient-to-br from-white via-cream-50 to-white p-6 sm:p-8 shadow-warm-lg space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-cream-200 pb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brown-500 block mb-1">
                      Stage 5: Final Authoritative Verdict
                    </span>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-4xl sm:text-5xl font-black font-display tracking-tight ${
                          decision.recommendation === "BUY"
                            ? "text-emerald-700"
                            : decision.recommendation === "SELL"
                            ? "text-brown-800"
                            : "text-amber-700"
                        }`}
                      >
                        {decision.recommendation}
                      </span>
                      <Badge
                        variant={decision.recommendation === "BUY" ? "pristine" : "brown"}
                        className="text-xs px-3 py-1 font-bold"
                      >
                        {decision.recommendation === "BUY"
                          ? "Certified Strong Purchase"
                          : decision.recommendation === "SELL"
                          ? "Optimal Liquidation"
                          : "Hold & Re-inspect"}
                      </Badge>
                    </div>
                  </div>

                  {/* Confidence Ring Gauge */}
                  <div className="rounded-2xl border border-cream-200 bg-white p-4 shadow-sm text-center min-w-[140px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brown-500">
                      Confidence Index
                    </span>
                    <div className="text-3xl font-black text-burgundy font-display my-1">
                      {decision.confidence}%
                    </div>
                    <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-burgundy h-full rounded-full transition-all duration-1000"
                        style={{ width: `${decision.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3 Key Factors */}
                {decision.keyFactors && decision.keyFactors.length > 0 && (
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-brown-700 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Key Decision Drivers
                    </span>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {decision.keyFactors.map((factor, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-cream-200 bg-white p-3.5 text-brown-800 flex items-start gap-3 shadow-sm"
                        >
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cream-100 text-burgundy font-bold text-[10px] shrink-0 mt-0.5">
                            {idx + 1}
                          </div>
                          <p className="leading-relaxed">{factor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Flags if any */}
                {decision.riskFlags && decision.riskFlags.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="h-4 w-4 text-amber-700" />
                      <span>Identified Risk Vectors:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-amber-800 text-[11px]">
                      {decision.riskFlags.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 7. FIXED BOTTOM ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-cream-300 bg-white/95 backdrop-blur-md py-3.5 px-4 shadow-warm-lg">
        <div className="mx-auto max-w-5xl flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-brown-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Backed by 42-Point ReTech Diagnostic Protocol</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              size="md"
              onClick={handleStartAnalysis}
              isLoading={isAnalyzing}
              leftIcon={<RotateCcw className="h-4 w-4" />}
            >
              Run New Analysis
            </Button>

            {/* Contextual Action Button */}
            {decision?.recommendation === "BUY" && (
              <Button
                variant="primary"
                size="md"
                className="shadow-warm"
                rightIcon={<ShoppingBag className="h-4 w-4" />}
                onClick={() => router.push(`/listings/${deviceId}`)}
              >
                Add to Cart with Guarantee
              </Button>
            )}

            {decision?.recommendation === "SELL" && (
              <Button
                variant="secondary"
                size="md"
                rightIcon={<TrendingUp className="h-4 w-4" />}
                onClick={() => router.push("/sell/create")}
              >
                Adjust Your Price & Relist
              </Button>
            )}

            {decision?.recommendation === "HOLD" && (
              <Button
                variant="outline"
                size="md"
                className="border-brown-400 text-brown-900"
                rightIcon={<Bookmark className="h-4 w-4" />}
                onClick={() => router.push(`/passport/${deviceId}`)}
              >
                Save & Watch Passport
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
