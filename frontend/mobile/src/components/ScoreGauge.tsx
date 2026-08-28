import React from "react";
import { View, Text } from "react-native";
import { Sparkles, ShieldCheck } from "lucide-react-native";

export function ScoreGauge({ score = 94 }: { score?: number }) {
  const getGrade = (s: number) => {
    if (s >= 90) return { label: "Pristine Circular Grade", color: "#059669", bg: "#ECFDF5" };
    if (s >= 80) return { label: "Excellent Grade", color: "#0284C7", bg: "#F0F9FF" };
    return { label: "Good Functional Grade", color: "#D97706", bg: "#FFFBEB" };
  };

  const grade = getGrade(score);

  return (
    <View className="bg-white rounded-2xl p-4 border border-cream-200 shadow-sm items-center">
      <View className="flex-row items-center gap-1.5 mb-2">
        <Sparkles size={14} color="#641F2A" />
        <Text className="text-xs font-bold text-brown-900 uppercase tracking-wider">
          Second-Life Score (SLS)
        </Text>
      </View>

      <View className="h-24 w-24 rounded-full border-4 border-emerald-500 items-center justify-center bg-emerald-50 my-2">
        <Text className="text-3xl font-black text-emerald-800 font-mono">{score}</Text>
        <Text className="text-[9px] font-bold text-emerald-700">/100</Text>
      </View>

      <View
        className="px-3 py-1 rounded-full mt-1"
        style={{ backgroundColor: grade.bg }}
      >
        <Text className="text-[11px] font-bold" style={{ color: grade.color }}>
          {grade.label}
        </Text>
      </View>

      <Text className="text-[10px] text-brown-500 text-center mt-2 px-4 leading-relaxed">
        Calculated across 42 diagnostic points: battery capacity, OEM parts, thermals & cycle life.
      </Text>
    </View>
  );
}
