import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../src/context/AuthContext";
import { CartProvider } from "../src/context/CartContext";
import { SocketProvider } from "../src/context/SocketContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <SocketProvider>
              <StatusBar style="dark" backgroundColor="#F8F3EA" />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: "#F8F3EA" },
                  headerTintColor: "#641F2A",
                  headerTitleStyle: { fontWeight: "bold" },
                  contentStyle: { backgroundColor: "#F8F3EA" },
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="listing/[id]"
                  options={{ title: "Device Details", presentation: "card" }}
                />
                <Stack.Screen
                  name="passport/scan"
                  options={{ title: "Scan Passport QR", presentation: "modal" }}
                />
                <Stack.Screen
                  name="sell/quick"
                  options={{ title: "AI Quick List", presentation: "modal" }}
                />
                <Stack.Screen
                  name="cart"
                  options={{ title: "Your Cart", presentation: "modal" }}
                />
              </Stack>
            </SocketProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
