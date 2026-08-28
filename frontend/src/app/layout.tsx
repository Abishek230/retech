import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ClientLayout } from "@/components/ui/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ReTech — AI-Powered Circular Marketplace for Refurbished Electronics",
  description:
    "Discover certified refurbished laptops, smartphones, and tech with AI optical diagnostics, 12-month warranty, and verified carbon savings. Cream, Brown, and Burgundy certified.",
  keywords: [
    "refurbished electronics",
    "circular economy",
    "AI diagnostics",
    "refurbished macbooks",
    "refurbished iphones",
    "e-waste reduction",
  ],
  authors: [{ name: "ReTech Engineering" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="min-h-screen flex flex-col bg-cream-50 text-brown-950 antialiased selection:bg-burgundy selection:text-white">
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <ClientLayout>{children}</ClientLayout>
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
