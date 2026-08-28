import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Search,
  QrCode,
  Camera,
  ShoppingBag,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Watch,
  TrendingUp,
} from "lucide-react-native";
import { useCart } from "../../src/context/CartContext";
import { ListingCard } from "../../src/components/ListingCard";
import { EcoImpactWidget } from "../../src/components/EcoImpactWidget";

const CATEGORIES = [
  { id: "all", name: "All", icon: <Sparkles size={14} color="#641F2A" /> },
  { id: "smartphones", name: "Phones", icon: <Smartphone size={14} color="#8A6652" /> },
  { id: "laptops", name: "Laptops", icon: <Laptop size={14} color="#8A6652" /> },
  { id: "tablets", name: "Tablets", icon: <Tablet size={14} color="#8A6652" /> },
  { id: "audio", name: "Audio", icon: <Headphones size={14} color="#8A6652" /> },
];

const FEATURED_LISTINGS = [
  {
    id: "iphone-15-pro",
    title: "iPhone 15 Pro 128GB - Natural Titanium",
    price: 849,
    condition: "Pristine",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    secondLifeScore: 98,
    sellerRating: 4.9,
  },
  {
    id: "macbook-pro-16",
    title: "MacBook Pro 16 M3 Max (36GB/1TB)",
    price: 2699,
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    secondLifeScore: 95,
    sellerRating: 5.0,
  },
  {
    id: "ipad-pro-12",
    title: "iPad Pro 12.9 M2 256GB Wi-Fi Space Gray",
    price: 799,
    condition: "Pristine",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
    secondLifeScore: 94,
    sellerRating: 4.8,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { itemCount } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} className="px-4 py-2">
        {/* Header Bar */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-black text-burgundy font-display">
              Re<Text className="text-brown-700">Tech</Text>
            </Text>
            <Text className="text-[10px] uppercase font-bold text-brown-500">
              Circular Hardware Hub
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={() => router.push("/passport/scan")}
              className="h-10 w-10 rounded-xl bg-white border border-cream-300 items-center justify-center shadow-sm"
            >
              <QrCode size={18} color="#641F2A" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/sell/quick")}
              className="h-10 w-10 rounded-xl bg-white border border-cream-300 items-center justify-center shadow-sm"
            >
              <Camera size={18} color="#8A6652" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/cart")}
              className="relative h-10 w-10 rounded-xl bg-burgundy items-center justify-center shadow-sm"
            >
              <ShoppingBag size={18} color="#FFFFFF" />
              {itemCount > 0 && (
                <View className="absolute -top-1 -right-1 bg-emerald-500 rounded-full h-4 w-4 items-center justify-center border border-white">
                  <Text className="text-[9px] font-bold text-white">{itemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white border border-cream-300 rounded-2xl px-3.5 py-2.5 mb-4 shadow-sm">
          <Search size={16} color="#8A6652" />
          <TextInput
            placeholder="Search certified phones, MacBooks, GPUs..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#A58C7A"
            className="flex-1 ml-2 text-xs font-semibold text-brown-950"
          />
        </View>

        {/* Categories Horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-5 -mx-4 px-4"
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                className={`mr-2.5 px-3.5 py-2 rounded-xl flex-row items-center gap-1.5 border ${
                  isActive
                    ? "bg-burgundy border-burgundy"
                    : "bg-white border-cream-300"
                }`}
              >
                {cat.icon}
                <Text
                  className={`text-xs font-bold ${
                    isActive ? "text-white" : "text-brown-800"
                  }`}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Banner Hero */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => router.push("/passport/scan")}
          className="bg-gradient-to-r from-burgundy to-burgundy-800 rounded-3xl p-5 mb-6 shadow-warm"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <View className="bg-cream-200/20 self-start px-2 py-0.5 rounded-full mb-1.5">
                <Text className="text-[10px] font-bold text-cream-100 uppercase">
                  NFC & QR Verification
                </Text>
              </View>
              <Text className="text-lg font-black text-white font-display mb-1">
                Scan Device Passport
              </Text>
              <Text className="text-xs text-cream-200 leading-snug">
                Audit cryptographically verified repair receipts, battery retention, & DoD wipes.
              </Text>
            </View>
            <View className="h-12 w-12 rounded-2xl bg-white/10 items-center justify-center">
              <QrCode size={24} color="#FFFFFF" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Featured Listings Section */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-1.5">
            <TrendingUp size={16} color="#641F2A" />
            <Text className="text-base font-black text-brown-950 font-display">
              Featured Hardware
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
            <Text className="text-xs font-bold text-burgundy">See All →</Text>
          </TouchableOpacity>
        </View>

        {FEATURED_LISTINGS.map((listing) => (
          <ListingCard key={listing.id} {...listing} />
        ))}

        {/* Eco Impact Widget */}
        <View className="mt-4 mb-8">
          <EcoImpactWidget />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
