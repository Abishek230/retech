import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  ShieldCheck,
  Leaf,
  Store,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
} from "lucide-react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-4 py-2">
        {/* User Card */}
        <View className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm mb-5">
          <View className="flex-row items-center gap-3.5 mb-4">
            <Image
              source={{
                uri:
                  user?.avatar ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
              }}
              className="h-14 w-14 rounded-2xl bg-cream-200 border border-cream-300"
            />
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text className="text-base font-black text-brown-950 font-display">
                  {user?.name || "Alex Rivera"}
                </Text>
                <View className="bg-emerald-100 px-1.5 py-0.2 rounded">
                  <Text className="text-[9px] font-bold text-emerald-800">Verified</Text>
                </View>
              </View>
              <Text className="text-xs text-brown-500">{user?.email}</Text>
            </View>
          </View>

          {/* Quick Impact Stats */}
          <View className="grid grid-cols-3 gap-2 border-t border-cream-100 pt-3 text-center">
            <View className="bg-cream-50 p-2 rounded-xl">
              <Text className="text-[9px] uppercase font-bold text-brown-400">CO₂ Saved</Text>
              <Text className="text-xs font-black text-emerald-700 font-mono">148.5 kg</Text>
            </View>
            <View className="bg-cream-50 p-2 rounded-xl">
              <Text className="text-[9px] uppercase font-bold text-brown-400">E-Waste</Text>
              <Text className="text-xs font-black text-brown-900 font-mono">840 g</Text>
            </View>
            <View className="bg-cream-50 p-2 rounded-xl">
              <Text className="text-[9px] uppercase font-bold text-brown-400">Score</Text>
              <Text className="text-xs font-black text-burgundy font-mono">Top 5%</Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm mb-5 divide-y divide-cream-100">
          <TouchableOpacity
            onPress={() => router.push("/sell/quick")}
            className="p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <Store size={18} color="#641F2A" />
              <Text className="text-xs font-bold text-brown-900">
                Seller Hub & AI Quick List
              </Text>
            </View>
            <ChevronRight size={16} color="#A58C7A" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/passport/scan")}
            className="p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <ShieldCheck size={18} color="#059669" />
              <Text className="text-xs font-bold text-brown-900">
                Scan Digital Life Passport
              </Text>
            </View>
            <ChevronRight size={16} color="#A58C7A" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {}}
            className="p-4 flex-row items-center justify-between"
          >
            <View className="flex-row items-center gap-3">
              <Settings size={18} color="#8A6652" />
              <Text className="text-xs font-bold text-brown-900">Settings & Security</Text>
            </View>
            <ChevronRight size={16} color="#A58C7A" />
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={() => logout()}
          className="bg-red-50 p-3.5 rounded-2xl flex-row items-center justify-center gap-2 border border-red-200"
        >
          <LogOut size={16} color="#DC2626" />
          <Text className="text-xs font-bold text-red-700">Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
