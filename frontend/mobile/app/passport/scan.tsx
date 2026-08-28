import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import {
  QrCode,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowLeft,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { PassportTimeline } from "../../src/components/PassportTimeline";

export default function PassportScanScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passportData, setPassportData] = useState<any>(null);

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    // Simulate cryptographic passport verification
    setTimeout(() => {
      setPassportData({
        deviceId: "dev_iphone_15_pro_9918",
        deviceName: "iPhone 15 Pro 128GB (Natural Titanium)",
        imei: "359182901248192",
        verifiedAt: "2026-08-15",
        verificationSeal: "RETECH-PASSPORT-ECDSA-VERIFIED",
        previousOwners: 1,
        repairs: 0,
      });
      setLoading(false);
    }, 1200);
  };

  const handleSimulateScan = () => {
    handleBarcodeScanned({ data: "retech:passport:dev_iphone_15_pro" });
  };

  const handleReset = () => {
    setScanned(false);
    setPassportData(null);
  };

  return (
    <View className="flex-1 bg-cream-50">
      {!scanned ? (
        <View className="flex-1">
          {/* Camera Viewfinder */}
          {permission?.granted ? (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: ["qr"],
              }}
              onBarcodeScanned={handleBarcodeScanned}
            />
          ) : (
            <View className="flex-1 items-center justify-center p-6 bg-brown-950">
              <QrCode size={48} color="#F8F3EA" />
              <Text className="text-white font-bold text-center mt-3 mb-4 text-xs leading-relaxed">
                ReTech needs camera permission to scan cryptographic device passports.
              </Text>
              <TouchableOpacity
                onPress={requestPermission}
                className="bg-burgundy px-5 py-3 rounded-2xl"
              >
                <Text className="text-white font-bold text-xs">Grant Camera Access</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Scanner Overlay Frame */}
          <View className="flex-1 justify-between p-6">
            <View className="bg-brown-950/70 p-3.5 rounded-2xl">
              <Text className="text-white text-center font-bold text-xs">
                Align Digital Life Passport QR Code
              </Text>
              <Text className="text-cream-300 text-center text-[10px] mt-0.5">
                Scanning laser active • Instant cryptographic verification
              </Text>
            </View>

            {/* Target Reticle */}
            <View className="h-64 w-64 self-center rounded-3xl border-2 border-dashed border-emerald-400 items-center justify-center bg-emerald-400/5">
              <QrCode size={36} color="#34D399" />
            </View>

            <TouchableOpacity
              onPress={handleSimulateScan}
              className="bg-white/90 p-3 rounded-2xl items-center shadow-lg"
            >
              <Text className="text-xs font-bold text-burgundy">
                ⚡ Simulate Instant Passport Scan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : loading ? (
        <View className="flex-1 items-center justify-center space-y-3">
          <ActivityIndicator size="large" color="#641F2A" />
          <Text className="text-xs font-bold text-brown-900">
            Validating cryptographic signature & DoD wipe receipts...
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 p-4">
          {/* Verified Header */}
          <View className="bg-emerald-900 p-5 rounded-3xl mb-5 space-y-2">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <ShieldCheck size={20} color="#6EE7B7" />
                <Text className="text-sm font-black text-white font-display">
                  Cryptographically Verified
                </Text>
              </View>
              <View className="bg-emerald-800 px-2 py-0.5 rounded-full">
                <Text className="text-[10px] font-bold text-emerald-300">Valid Passport</Text>
              </View>
            </View>

            <Text className="text-base font-bold text-white">
              {passportData?.deviceName}
            </Text>

            <View className="flex-row items-center justify-between pt-2 border-t border-emerald-800 text-[10px] text-emerald-200">
              <Text className="font-mono">IMEI: {passportData?.imei}</Text>
              <Text className="font-mono">{passportData?.verifiedAt}</Text>
            </View>
          </View>

          {/* Timeline Events */}
          <View className="mb-6 space-y-2">
            <Text className="text-xs font-bold text-brown-900 uppercase">
              Chronological Audit Trail
            </Text>
            <PassportTimeline />
          </View>

          {/* Scan Another Button */}
          <TouchableOpacity
            onPress={handleReset}
            className="bg-burgundy py-3.5 rounded-2xl items-center flex-row justify-center gap-2 shadow-warm mb-8"
          >
            <RotateCcw size={16} color="#FFFFFF" />
            <Text className="text-xs font-bold text-white font-display">
              Scan Another Passport
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
