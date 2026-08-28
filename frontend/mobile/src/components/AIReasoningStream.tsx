import React from "react";
import { View, Text } from "react-native";
import { Cpu, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react-native";

interface ToolProgress {
  name: string;
  status: "pending" | "running" | "completed";
  summary?: string;
}

export function AIReasoningStream({
  tools = [],
  reasoning = "",
  verdict = "BUY",
  confidence = 94,
}: {
  tools?: ToolProgress[];
  reasoning?: string;
  verdict?: "BUY" | "SELL" | "HOLD";
  confidence?: number;
}) {
  const defaultTools: ToolProgress[] = [
    { name: "getSecondLifeScore", status: "completed", summary: "Score 94.2/100 (Pristine Grade)" },
    { name: "getDigitalLifePassport", status: "completed", summary: "DoD 5220.22-M wipe certified" },
    { name: "getMarketPriceRange", status: "completed", summary: "Market range: $890–$950" },
    { name: "getSustainabilityImpact", status: "completed", summary: "74kg CO2 abated vs new" },
  ];

  const toolList = tools.length > 0 ? tools : defaultTools;

  return (
    <View className="space-y-4">
      {/* 1. Planned Tools */}
      <View className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm space-y-2">
        <Text className="text-xs font-bold text-brown-900 uppercase">
          Agent Diagnostic Telemetry
        </Text>
        {toolList.map((t, idx) => (
          <View key={idx} className="flex-row items-center justify-between py-1.5 border-b border-cream-100">
            <View className="flex-row items-center gap-2">
              <CheckCircle2 size={12} color="#059669" />
              <Text className="text-xs font-mono text-brown-950">{t.name}</Text>
            </View>
            <Text className="text-[10px] font-bold text-emerald-700">{t.summary || "Done"}</Text>
          </View>
        ))}
      </View>

      {/* 2. Reasoning Text */}
      <View className="bg-cream-100/70 p-4 rounded-2xl border border-cream-300">
        <Text className="text-[10px] font-bold uppercase text-brown-600 mb-1">
          Bayesian Synthesis Stream
        </Text>
        <Text className="text-xs text-brown-800 leading-relaxed font-mono">
          {reasoning ||
            "Analysis complete: Pristine cosmetic integrity (Grade A+), battery capacity at 98% OEM spec. Priced 12% below secondary market benchmark with full 12-month ReTech certified warranty."}
        </Text>
      </View>

      {/* 3. Verdict Card */}
      <View
        className={`p-5 rounded-3xl items-center ${
          verdict === "BUY"
            ? "bg-emerald-900"
            : verdict === "SELL"
            ? "bg-burgundy"
            : "bg-brown-900"
        }`}
      >
        <Text className="text-xs font-bold text-cream-200 uppercase tracking-widest">
          AI Autonomous Verdict
        </Text>
        <Text className="text-4xl font-black text-white font-display my-1">{verdict}</Text>
        <Text className="text-xs text-cream-100 font-bold">
          Confidence: {confidence}% (High Certainty)
        </Text>
      </View>
    </View>
  );
}
