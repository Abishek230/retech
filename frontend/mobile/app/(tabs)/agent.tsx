import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Sparkles,
  Cpu,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
  Play,
  CheckCircle2,
} from "lucide-react-native";
import { AIReasoningStream } from "../../src/components/AIReasoningStream";
import { useCart } from "../../src/context/CartContext";

export default function AgentScreen() {
  const { addToCart } = useCart();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-4 py-2">
        {/* Agent Header */}
        <View className="bg-white p-4 rounded-2xl border border-cream-200 shadow-sm mb-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="h-9 w-9 rounded-xl bg-burgundy items-center justify-center">
                <Sparkles size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-sm font-black text-brown-950 font-display">
                  ReTech Autonomous Agent
                </Text>
                <Text className="text-[10px] text-emerald-700 font-bold">
                  ● 6 Neural Tools Connected
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRunAnalysis}
              className="bg-cream-200 px-3 py-1.5 rounded-xl flex-row items-center gap-1"
            >
              <RotateCcw size={12} color="#641F2A" />
              <Text className="text-[11px] font-bold text-burgundy">Re-Analyze</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Target Device Banner */}
        <View className="bg-cream-100 p-3.5 rounded-2xl border border-cream-300 mb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-[10px] uppercase font-bold text-brown-500">Target Hardware</Text>
            <Text className="text-xs font-bold text-brown-950">
              iPhone 15 Pro 128GB (Natural Titanium)
            </Text>
          </View>
          <Text className="text-sm font-black text-burgundy font-mono">$849</Text>
        </View>

        {isAnalyzing ? (
          <View className="py-16 items-center justify-center space-y-3">
            <ActivityIndicator size="large" color="#641F2A" />
            <Text className="text-xs font-bold text-brown-700">
              Executing multi-factor Bayesian diagnostic plan...
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            <AIReasoningStream verdict="BUY" confidence={94} />

            {/* Action Bar */}
            <View className="pt-2 pb-8 space-y-2">
              <TouchableOpacity
                onPress={() =>
                  addToCart({
                    id: "iphone-15-pro",
                    title: "iPhone 15 Pro 128GB",
                    price: 849,
                  })
                }
                className="bg-burgundy py-3.5 rounded-2xl items-center flex-row justify-center gap-2 shadow-warm"
              >
                <ShoppingBag size={16} color="#FFFFFF" />
                <Text className="text-xs font-bold text-white font-display">
                  Add Recommended Device to Cart ($849)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
