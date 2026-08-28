import React from "react";
import { View, Text } from "react-native";
import { Wrench, UserCheck, ShieldCheck, Award, RotateCcw } from "lucide-react-native";

interface PassportEntry {
  id: string;
  type: string;
  description: string;
  date: string;
  performedBy: string;
  proofHash?: string;
}

export function PassportTimeline({ entries = [] }: { entries?: PassportEntry[] }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "REPAIR":
        return <Wrench size={14} color="#8A6652" />;
      case "OWNERSHIP":
        return <UserCheck size={14} color="#059669" />;
      case "INSPECTION":
        return <ShieldCheck size={14} color="#641F2A" />;
      case "CERTIFICATION":
        return <Award size={14} color="#F59E0B" />;
      default:
        return <RotateCcw size={14} color="#641F2A" />;
    }
  };

  const defaultEntries: PassportEntry[] = [
    {
      id: "e1",
      type: "CERTIFICATION",
      description: "Tier-1 Circular Quality Certification & Optical Sensor Audit",
      date: "2026-08-15",
      performedBy: "Austin Circular Labs (Certified)",
      proofHash: "0x89f4b7a1...certified",
    },
    {
      id: "e2",
      type: "FACTORY_RESET",
      description: "NIST SP 800-88 Rev 1 / DoD 5220.22-M Cryptographic Sanitization",
      date: "2026-08-10",
      performedBy: "ReTech Automated Secure Wipe",
      proofHash: "0x3e19c4d2...wiped",
    },
    {
      id: "e3",
      type: "INSPECTION",
      description: "Battery retain check: 98% OEM retention capacity validated",
      date: "2026-08-01",
      performedBy: "iFixit Certified Diagnostics",
    },
  ];

  const items = entries.length > 0 ? entries : defaultEntries;

  return (
    <View className="space-y-4">
      {items.map((entry, index) => (
        <View key={entry.id || index} className="flex-row items-start gap-3">
          {/* Timeline Dot & Line */}
          <View className="items-center">
            <View className="h-7 w-7 rounded-full bg-cream-200 items-center justify-center border border-cream-300">
              {getIcon(entry.type)}
            </View>
            {index < items.length - 1 && (
              <View className="w-0.5 h-12 bg-cream-300 my-1" />
            )}
          </View>

          {/* Content */}
          <View className="flex-1 bg-white p-3.5 rounded-xl border border-cream-200 shadow-sm">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[10px] font-bold text-burgundy uppercase">
                {entry.type}
              </Text>
              <Text className="text-[9px] text-brown-400 font-mono">
                {entry.date}
              </Text>
            </View>

            <Text className="text-xs font-bold text-brown-950 mb-1 leading-snug">
              {entry.description}
            </Text>

            <Text className="text-[10px] text-brown-600 font-mono">
              Auth: {entry.performedBy}
            </Text>

            {entry.proofHash && (
              <Text className="text-[9px] text-emerald-700 font-mono mt-1">
                Hash: {entry.proofHash}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
