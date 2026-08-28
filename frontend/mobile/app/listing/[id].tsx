import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  Cpu,
  RotateCcw,
  CheckCircle2,
  Star,
  ChevronRight,
} from "lucide-react-native";
import { useCart } from "../../src/context/CartContext";
import { ScoreGauge } from "../../src/components/ScoreGauge";
import { PassportTimeline } from "../../src/components/PassportTimeline";

const { width } = Dimensions.get("window");

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const listing = {
    id: id || "iphone-15-pro",
    title: "iPhone 15 Pro 128GB - Natural Titanium",
    price: 849,
    originalPrice: 999,
    condition: "Pristine",
    score: 98,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80",
    ],
    specs: {
      storage: "128GB NVMe",
      ram: "8GB Unified",
      battery: "98% Retained Health (42 Cycles)",
      sanitization: "DoD 5220.22-M Certified",
      warranty: "12-Month ReTech Certified",
    },
    seller: {
      name: "Austin Circular Labs",
      rating: 4.9,
      sales: 420,
      tier: "PRO_SELLER",
    },
  };

  const handleAddToCart = () => {
    addToCart(listing);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <View className="flex-1 bg-cream-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Full-width Image Carousel */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="bg-white border-b border-cream-200"
          style={{ height: width * 0.85 }}
        >
          {listing.images.map((img, i) => (
            <View key={i} style={{ width }} className="items-center justify-center p-4">
              <Image
                source={{ uri: img }}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>

        <View className="p-4 space-y-5">
          {/* Title & Price Header */}
          <View>
            <View className="flex-row items-center gap-2 mb-1">
              <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-emerald-800 uppercase">
                  {listing.condition} Grade
                </Text>
              </View>
              <Text className="text-[10px] font-mono text-brown-500">
                12-Mo ReTech Warranty Included
              </Text>
            </View>

            <Text className="text-xl font-black text-brown-950 font-display mb-1.5">
              {listing.title}
            </Text>

            <View className="flex-row items-baseline gap-2">
              <Text className="text-xl font-black text-burgundy font-mono">
                ₹{Math.round(listing.price * 83.5).toLocaleString("en-IN")}{" "}
                <Text className="text-sm font-semibold text-brown-500 font-sans">(${listing.price.toLocaleString()})</Text>
              </Text>
              <Text className="text-xs text-brown-400 line-through font-mono">
                ${listing.originalPrice}
              </Text>
            </View>
          </View>

          {/* AI Decision Agent CTA */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push("/(tabs)/agent")}
            className="bg-gradient-to-r from-burgundy-900 to-burgundy p-4 rounded-2xl flex-row items-center justify-between shadow-warm"
          >
            <View className="flex-row items-center gap-2.5 flex-1">
              <View className="h-9 w-9 rounded-xl bg-white/10 items-center justify-center">
                <Sparkles size={18} color="#FFFFFF" />
              </View>
              <View>
                <Text className="text-xs font-bold text-white font-display">
                  Ask Autonomous AI Agent
                </Text>
                <Text className="text-[10px] text-cream-200">
                  Live market pricing, health & BUY/HOLD reasoning
                </Text>
              </View>
            </View>
            <ChevronRight size={16} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Second-Life Score Gauge */}
          <ScoreGauge score={listing.score} />

          {/* Hardware Specifications */}
          <View className="bg-white p-4 rounded-2xl border border-cream-200 space-y-2 shadow-sm">
            <Text className="text-xs font-bold text-brown-900 uppercase">
              Certified Hardware Specifications
            </Text>
            {Object.entries(listing.specs).map(([key, val]) => (
              <View key={key} className="flex-row items-center justify-between py-1.5 border-b border-cream-100">
                <Text className="text-xs text-brown-500 capitalize">{key}</Text>
                <Text className="text-xs font-bold text-brown-950 font-mono">{val}</Text>
              </View>
            ))}
          </View>

          {/* Verified Seller Info */}
          <View className="bg-white p-4 rounded-2xl border border-cream-200 flex-row items-center justify-between shadow-sm">
            <View>
              <Text className="text-[10px] uppercase font-bold text-brown-400">
                Verified Refurbisher
              </Text>
              <Text className="text-xs font-bold text-brown-950 font-display">
                {listing.seller.name}
              </Text>
              <Text className="text-[10px] text-emerald-700 font-semibold">
                ★ {listing.seller.rating} • {listing.seller.sales}+ Orders
              </Text>
            </View>
            <View className="bg-cream-100 px-2.5 py-1 rounded-xl">
              <Text className="text-[10px] font-bold text-burgundy">Pro Tier</Text>
            </View>
          </View>

          {/* Digital Life Passport Preview */}
          <View className="space-y-2">
            <Text className="text-xs font-bold text-brown-900 uppercase">
              Permanent Digital Life Passport
            </Text>
            <PassportTimeline />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sticky Add to Cart Bar */}
      <View className="bg-white p-4 border-t border-cream-200 flex-row items-center justify-between gap-3">
        <View>
          <Text className="text-[10px] uppercase font-bold text-brown-400">Total Price</Text>
          <Text className="text-base font-black text-burgundy font-mono">
            ₹{Math.round(listing.price * 83.5).toLocaleString("en-IN")}{" "}
            <Text className="text-[10px] font-semibold text-brown-500 font-sans">(${listing.price.toLocaleString()})</Text>
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleAddToCart}
          className="flex-1 bg-burgundy py-3.5 rounded-2xl items-center flex-row justify-center gap-2 shadow-warm"
        >
          {added ? (
            <>
              <CheckCircle2 size={16} color="#FFFFFF" />
              <Text className="text-xs font-bold text-white">Added to Cart ✓</Text>
            </>
          ) : (
            <>
              <ShoppingBag size={16} color="#FFFFFF" />
              <Text className="text-xs font-bold text-white font-display">
                Add to Cart
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
