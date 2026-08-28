import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react-native";
import { ListingCard } from "../../src/components/ListingCard";

const ALL_LISTINGS = [
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
  {
    id: "dell-xps-15",
    title: "Dell XPS 15 OLED 4K (32GB RAM / 1TB SSD)",
    price: 1399,
    condition: "Excellent",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
    secondLifeScore: 91,
    sellerRating: 4.7,
  },
  {
    id: "sony-wh1000xm5",
    title: "Sony WH-1000XM5 Wireless ANC Headphones",
    price: 279,
    condition: "Pristine",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    secondLifeScore: 97,
    sellerRating: 4.9,
  },
];

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");

  const BRANDS = ["All", "Apple", "Dell", "Sony", "Samsung"];

  const filtered = ALL_LISTINGS.filter((l) =>
    l.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-cream-50" edges={["top"]}>
      <View className="px-4 py-2 flex-1">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-black text-brown-950 font-display">
            Explore Hardware
          </Text>
          <View className="flex-row items-center gap-1 bg-white px-2.5 py-1 rounded-xl border border-cream-300">
            <ArrowUpDown size={12} color="#8A6652" />
            <Text className="text-[11px] font-bold text-brown-700">SLS Score</Text>
          </View>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white border border-cream-300 rounded-2xl px-3.5 py-2 mb-3 shadow-sm">
          <Search size={16} color="#8A6652" />
          <TextInput
            placeholder="Search all circular hardware..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#A58C7A"
            className="flex-1 ml-2 text-xs font-semibold text-brown-950"
          />
        </View>

        {/* Brand Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="max-h-10 mb-3 -mx-4 px-4"
        >
          {BRANDS.map((b) => (
            <TouchableOpacity
              key={b}
              onPress={() => setSelectedBrand(b)}
              className={`mr-2 px-3 py-1.5 rounded-xl border ${
                selectedBrand === b
                  ? "bg-burgundy border-burgundy"
                  : "bg-white border-cream-300"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  selectedBrand === b ? "text-white" : "text-brown-700"
                }`}
              >
                {b}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Listings Feed */}
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {filtered.map((item) => (
            <ListingCard key={item.id} {...item} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
