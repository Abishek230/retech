import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Camera,
  Sparkles,
  CheckCircle2,
  Upload,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react-native";

export default function SellerQuickListScreen() {
  const router = useRouter();
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [recognized, setRecognized] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  // Form State
  const [form, setForm] = useState({
    brand: "Apple",
    model: "iPhone 15 Pro",
    storage: "128GB",
    condition: "Pristine",
    suggestedPrice: "849",
    userPrice: "849",
    slsEstimate: "98",
  });

  const handleCapturePhoto = () => {
    setAnalyzingImage(true);
    // Simulate AI Vision device classification
    setTimeout(() => {
      setAnalyzingImage(false);
      setRecognized(true);
    }, 1200);
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      setPublished(true);
    }, 1000);
  };

  return (
    <View className="flex-1 bg-cream-50">
      <ScrollView showsVerticalScrollIndicator={false} className="p-4 flex-1">
        {published ? (
          <View className="py-12 items-center text-center space-y-4">
            <View className="h-16 w-16 rounded-3xl bg-emerald-100 items-center justify-center">
              <CheckCircle2 size={32} color="#059669" />
            </View>
            <Text className="text-xl font-black text-brown-950 font-display">
              Device Published Live!
            </Text>
            <Text className="text-xs text-brown-600 text-center px-4 leading-relaxed">
              Your {form.brand} {form.model} is now active on the circular marketplace and protected by ReTech Escrow.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/explore")}
              className="bg-burgundy px-6 py-3.5 rounded-2xl shadow-warm"
            >
              <Text className="text-xs font-bold text-white font-display">
                View in Marketplace
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4">
            {/* 1. Camera Capture & Vision Header */}
            <View className="bg-white p-4 rounded-3xl border border-cream-200 shadow-sm space-y-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Camera size={18} color="#641F2A" />
                  <Text className="text-xs font-bold text-brown-950 font-display">
                    Camera Hardware Recognition
                  </Text>
                </View>
                {recognized && (
                  <View className="bg-emerald-100 px-2 py-0.5 rounded-full">
                    <Text className="text-[10px] font-bold text-emerald-800">
                      AI Vision Matched ✓
                    </Text>
                  </View>
                )}
              </View>

              {/* Photo Box */}
              <View className="h-44 w-full rounded-2xl bg-cream-100 border-2 border-dashed border-cream-300 items-center justify-center relative overflow-hidden">
                {analyzingImage ? (
                  <View className="items-center space-y-2">
                    <ActivityIndicator size="small" color="#641F2A" />
                    <Text className="text-[11px] font-bold text-brown-700">
                      AI identifying optical model & chassis grade...
                    </Text>
                  </View>
                ) : recognized ? (
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
                    }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={handleCapturePhoto}
                    className="items-center space-y-1.5"
                  >
                    <View className="h-10 w-10 rounded-full bg-cream-200 items-center justify-center">
                      <Camera size={20} color="#641F2A" />
                    </View>
                    <Text className="text-xs font-bold text-brown-900">
                      Tap to Photograph Device
                    </Text>
                    <Text className="text-[10px] text-brown-500">
                      Auto-detects brand, model, cosmetics & SLS
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {!recognized && (
                <TouchableOpacity
                  onPress={handleCapturePhoto}
                  className="bg-cream-200 py-2.5 rounded-xl items-center"
                >
                  <Text className="text-xs font-bold text-burgundy">
                    ⚡ Auto-Recognize Device via AI
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* 2. Auto-Filled Specifications */}
            {recognized && (
              <View className="bg-white p-5 rounded-3xl border border-cream-200 shadow-sm space-y-3.5">
                <Text className="text-xs font-bold text-brown-950 uppercase">
                  Verified Device Attributes
                </Text>

                <View className="space-y-2.5 text-xs">
                  <View>
                    <Text className="text-[10px] font-bold text-brown-500 uppercase mb-1">
                      Brand & Model
                    </Text>
                    <TextInput
                      value={`${form.brand} ${form.model}`}
                      className="bg-cream-50 p-2.5 rounded-xl border border-cream-200 text-xs font-bold text-brown-950 font-display"
                    />
                  </View>

                  <View className="grid grid-cols-2 gap-2">
                    <View>
                      <Text className="text-[10px] font-bold text-brown-500 uppercase mb-1">
                        Storage
                      </Text>
                      <TextInput
                        value={form.storage}
                        className="bg-cream-50 p-2.5 rounded-xl border border-cream-200 text-xs font-bold text-brown-950"
                      />
                    </View>
                    <View>
                      <Text className="text-[10px] font-bold text-brown-500 uppercase mb-1">
                        Condition
                      </Text>
                      <TextInput
                        value={form.condition}
                        className="bg-cream-50 p-2.5 rounded-xl border border-cream-200 text-xs font-bold text-emerald-800"
                      />
                    </View>
                  </View>

                  <View>
                    <Text className="text-[10px] font-bold text-brown-500 uppercase mb-1">
                      Listing Price ($ USD)
                    </Text>
                    <TextInput
                      value={form.userPrice}
                      onChangeText={(val) => setForm({ ...form, userPrice: val })}
                      keyboardType="numeric"
                      className="bg-cream-50 p-2.5 rounded-xl border border-cream-200 text-sm font-black text-burgundy font-mono"
                    />
                  </View>
                </View>

                {/* AI SLS & Valuation Insight */}
                <View className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 space-y-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-[10px] font-bold text-emerald-900">
                      Estimated Second-Life Score:
                    </Text>
                    <Text className="text-xs font-black text-emerald-800 font-mono">
                      {form.slsEstimate}/100
                    </Text>
                  </View>
                  <Text className="text-[10px] text-emerald-700 leading-tight">
                    Recommended market range: $830–$860 based on 48 recent circular sales.
                  </Text>
                </View>

                {/* Publish Button */}
                <TouchableOpacity
                  onPress={handlePublish}
                  disabled={publishing}
                  className="bg-burgundy py-3.5 rounded-2xl items-center flex-row justify-center gap-2 shadow-warm mt-2"
                >
                  {publishing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Sparkles size={16} color="#FFFFFF" />
                      <Text className="text-xs font-bold text-white font-display">
                        Publish Device to Marketplace
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
