import React from "react";
import { View, Text } from "react-native";
import { Leaf, Droplets, Trees, Trash2 } from "lucide-react-native";

interface EcoImpactProps {
  co2SavedKg?: number;
  eWasteGrams?: number;
  treesEquivalent?: number;
  waterLiters?: number;
}

export function EcoImpactWidget({
  co2SavedKg = 148.5,
  eWasteGrams = 840,
  treesEquivalent = 7.1,
  waterLiters = 840,
}: EcoImpactProps) {
  return (
    <View className="bg-emerald-900 rounded-3xl p-5 shadow-sm">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="h-7 w-7 rounded-xl bg-emerald-800 items-center justify-center">
            <Leaf size={14} color="#6EE7B7" />
          </View>
          <Text className="text-sm font-bold text-white font-display">
            Your Circular Footprint
          </Text>
        </View>
        <View className="bg-emerald-800/80 px-2 py-0.5 rounded-full">
          <Text className="text-[10px] font-bold text-emerald-300">Net Positive</Text>
        </View>
      </View>

      <View className="grid grid-cols-2 gap-3 mt-1">
        <View className="bg-emerald-800/60 p-3 rounded-2xl">
          <Text className="text-[10px] text-emerald-300 font-bold uppercase">CO₂ Abated</Text>
          <Text className="text-xl font-black text-white font-mono mt-0.5">
            {co2SavedKg} <Text className="text-xs font-normal text-emerald-200">kg</Text>
          </Text>
        </View>

        <View className="bg-emerald-800/60 p-3 rounded-2xl">
          <Text className="text-[10px] text-emerald-300 font-bold uppercase">E-Waste Diverted</Text>
          <Text className="text-xl font-black text-white font-mono mt-0.5">
            {eWasteGrams} <Text className="text-xs font-normal text-emerald-200">g</Text>
          </Text>
        </View>

        <View className="bg-emerald-800/60 p-3 rounded-2xl">
          <Text className="text-[10px] text-emerald-300 font-bold uppercase">Trees Eq.</Text>
          <Text className="text-xl font-black text-white font-mono mt-0.5">
            {treesEquivalent} <Text className="text-xs font-normal text-emerald-200">trees</Text>
          </Text>
        </View>

        <View className="bg-emerald-800/60 p-3 rounded-2xl">
          <Text className="text-[10px] text-emerald-300 font-bold uppercase">Water Conserved</Text>
          <Text className="text-xl font-black text-white font-mono mt-0.5">
            {waterLiters} <Text className="text-xs font-normal text-emerald-200">L</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
