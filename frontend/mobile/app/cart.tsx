import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Leaf,
  CheckCircle2,
  ArrowRight,
} from "lucide-react-native";
import { useCart } from "../src/context/CartContext";

export default function CartScreen() {
  const router = useRouter();
  const { items, total, removeFromCart, clearCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => {
      setCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  return (
    <View className="flex-1 bg-cream-50">
      <ScrollView showsVerticalScrollIndicator={false} className="p-4 flex-1">
        {orderComplete ? (
          <View className="py-16 items-center text-center space-y-4">
            <View className="h-16 w-16 rounded-3xl bg-emerald-100 items-center justify-center">
              <CheckCircle2 size={32} color="#059669" />
            </View>
            <Text className="text-2xl font-black text-brown-950 font-display">
              Order Confirmed!
            </Text>
            <Text className="text-xs text-brown-600 text-center px-4 leading-relaxed">
              Your payment is secured in ReTech Escrow. 12-Month Certified Warranty & Digital Life Passport are now active.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/orders")}
              className="bg-burgundy px-6 py-3.5 rounded-2xl shadow-warm mt-2"
            >
              <Text className="text-xs font-bold text-white font-display">
                Track Order & Warranty
              </Text>
            </TouchableOpacity>
          </View>
        ) : items.length === 0 ? (
          <View className="py-20 items-center space-y-3">
            <ShoppingBag size={48} color="#C0AEA0" />
            <Text className="text-sm font-bold text-brown-500">Your cart is empty</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/explore")}
              className="bg-burgundy px-5 py-2.5 rounded-xl mt-2"
            >
              <Text className="text-xs font-bold text-white font-display">
                Explore Certified Hardware
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            {/* Cart Items */}
            <View className="space-y-3">
              {items.map((item) => (
                <View
                  key={item.id}
                  className="bg-white p-3.5 rounded-2xl border border-cream-200 shadow-sm flex-row items-center justify-between gap-3"
                >
                  <Image
                    source={{ uri: item.image }}
                    className="h-14 w-14 rounded-xl bg-cream-50"
                    resizeMode="contain"
                  />

                  <View className="flex-1">
                    <Text className="text-xs font-bold text-brown-950" numberOfLines={1}>
                      {item.title}
                    </Text>
                    <Text className="text-sm font-black text-burgundy font-mono mt-0.5">
                      ${item.price.toLocaleString()}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => removeFromCart(item.listingId)}
                    className="h-8 w-8 rounded-lg bg-red-50 items-center justify-center border border-red-100"
                  >
                    <Trash2 size={14} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Escrow & Guarantees */}
            <View className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
              <View className="flex-row items-center gap-2">
                <ShieldCheck size={16} color="#059669" />
                <Text className="text-xs font-bold text-emerald-900">
                  ReTech Escrow Protection
                </Text>
              </View>
              <Text className="text-[10px] text-emerald-800 leading-relaxed">
                Funds are held in 2-day escrow until you verify your hardware condition. Full refund guarantee.
              </Text>
            </View>

            {/* Summary */}
            <View className="bg-white p-4 rounded-2xl border border-cream-200 space-y-2 text-xs">
              <View className="flex-row items-center justify-between text-brown-600">
                <Text className="text-xs text-brown-600">Subtotal</Text>
                <Text className="text-xs font-mono font-bold text-brown-950">
                  ${total.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row items-center justify-between text-brown-600">
                <Text className="text-xs text-brown-600">12-Mo Certified Warranty</Text>
                <Text className="text-xs font-mono font-bold text-emerald-700">FREE ($0)</Text>
              </View>
              <View className="flex-row items-center justify-between text-brown-600">
                <Text className="text-xs text-brown-600">Insured FedEx Shipping</Text>
                <Text className="text-xs font-mono font-bold text-emerald-700">FREE ($0)</Text>
              </View>
              <View className="flex-row items-center justify-between pt-2 border-t border-cream-200">
                <Text className="text-sm font-black text-brown-950 font-display">Total</Text>
                <Text className="text-lg font-black text-burgundy font-mono">
                  ${total.toLocaleString()} USD
                </Text>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              onPress={handleCheckout}
              disabled={checkingOut}
              className="bg-burgundy py-4 rounded-2xl items-center flex-row justify-center gap-2 shadow-warm mb-8"
            >
              <Text className="text-xs font-bold text-white font-display">
                {checkingOut ? "Processing Stripe Escrow..." : `Pay $${total.toLocaleString()} with Stripe`}
              </Text>
              <ArrowRight size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
