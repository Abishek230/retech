import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Sparkles, ShieldCheck, Star } from "lucide-react-native";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  image: string;
  secondLifeScore?: number;
  sellerRating?: number;
}

export function ListingCard({
  id,
  title,
  price,
  condition,
  image,
  secondLifeScore = 95,
  sellerRating = 4.9,
}: ListingCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/listing/${id}`)}
      className="bg-white rounded-2xl p-3.5 border border-cream-200 shadow-sm mb-3.5"
    >
      <View className="relative h-44 w-full rounded-xl overflow-hidden bg-cream-50 mb-3 items-center justify-center">
        <Image
          source={{ uri: image }}
          className="h-full w-full"
          resizeMode="contain"
        />
        {/* SLS Badge */}
        <View className="absolute top-2 left-2 bg-emerald-600 px-2 py-0.5 rounded-full flex-row items-center gap-1">
          <Sparkles size={10} color="#FFFFFF" />
          <Text className="text-[10px] font-bold text-white">SLS {secondLifeScore}/100</Text>
        </View>

        {/* Condition Badge */}
        <View className="absolute top-2 right-2 bg-cream-200/90 px-2 py-0.5 rounded-full">
          <Text className="text-[9px] font-bold text-brown-800 uppercase">{condition}</Text>
        </View>
      </View>

      <Text className="text-sm font-bold text-brown-950 mb-1" numberOfLines={1}>
        {title}
      </Text>

      <View className="flex-row items-center justify-between mt-1">
        <Text className="text-base font-black text-burgundy font-mono">
          ₹{Math.round(price * 83.5).toLocaleString("en-IN")}{" "}
          <Text className="text-xs font-semibold text-brown-500 font-sans">(${price.toLocaleString()})</Text>
        </Text>
        
        <View className="flex-row items-center gap-1">
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text className="text-[11px] font-bold text-brown-700">{sellerRating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
