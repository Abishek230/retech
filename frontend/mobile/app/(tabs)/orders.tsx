import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Package, Truck, ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react-native";

const ORDERS = [
  {
    id: "ord_101",
    orderNumber: "#RET-8491A",
    title: "iPhone 15 Pro 128GB - Natural Titanium",
    price: 849,
    status: "DELIVERED",
    date: "2026-08-20",
    carrier: "FedEx Express (794628192)",
    warrantyStatus: "ACTIVE (361 Days Left)",
  },
  {
    id: "ord_102",
    orderNumber: "#RET-3912B",
    title: "MacBook Pro 14 M3 Pro (18GB/512GB)",
    price: 1499,
    status: "IN_TRANSIT",
    date: "2026-08-23",
    carrier: "UPS Next Day Air (1Z9999999999)",
    warrantyStatus: "ACTIVE (365 Days Left)",
  },
];

export default function OrdersScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-4 py-2">
        <Text className="text-2xl font-black text-brown-950 font-display mb-4">
          Your Circular Orders
        </Text>

        <View className="space-y-4">
          {ORDERS.map((order) => (
            <View
              key={order.id}
              className="bg-white p-4 rounded-3xl border border-cream-200 shadow-sm space-y-3"
            >
              <View className="flex-row items-center justify-between border-b border-cream-100 pb-2.5">
                <View className="flex-row items-center gap-2">
                  <Package size={16} color="#641F2A" />
                  <Text className="text-xs font-bold font-mono text-brown-950">
                    {order.orderNumber}
                  </Text>
                </View>
                <View
                  className={`px-2 py-0.5 rounded-full ${
                    order.status === "DELIVERED" ? "bg-emerald-100" : "bg-amber-100"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-bold ${
                      order.status === "DELIVERED" ? "text-emerald-800" : "text-amber-800"
                    }`}
                  >
                    {order.status}
                  </Text>
                </View>
              </View>

              <View>
                <Text className="text-sm font-bold text-brown-950 mb-0.5 font-display">
                  {order.title}
                </Text>
                <Text className="text-xs font-black text-burgundy font-mono">
                  ${order.price.toLocaleString()} USD
                </Text>
              </View>

              <View className="bg-cream-50 p-2.5 rounded-xl border border-cream-200 space-y-1">
                <View className="flex-row items-center gap-1.5">
                  <Truck size={12} color="#8A6652" />
                  <Text className="text-[10px] text-brown-700 font-mono">{order.carrier}</Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <ShieldCheck size={12} color="#059669" />
                  <Text className="text-[10px] text-emerald-800 font-bold">
                    Warranty: {order.warrantyStatus}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
