"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Loader2, ShieldAlert, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";

const PUBLIC_PATHS = ["/", "/login", "/register"];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  const hideLayout = ["/", "/login", "/register"].includes(pathname);

  // Route protection redirect effect
  useEffect(() => {
    if (isLoading) return;

    // 1. Unauthenticated users trying to access protected paths
    if (!isAuthenticated && !isPublicPath) {
      router.replace(`/?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Authenticated users trying to access /login or /register
    if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
      if (user?.role === "ADMIN") {
        router.replace("/admin");
      } else if (user?.role === "SELLER") {
        router.replace("/seller/dashboard");
      } else {
        router.replace("/marketplace");
      }
      return;
    }

    // 3. Role-based restrictions
    if (isAuthenticated && user) {
      if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
        router.replace(user.role === "SELLER" ? "/seller/dashboard" : "/marketplace");
        return;
      }
      if (pathname.startsWith("/seller") && user.role === "BUYER") {
        router.replace("/marketplace");
        return;
      }
    }
  }, [isAuthenticated, isLoading, isPublicPath, pathname, router, user]);

  // Loading state while resolving auth on protected pages
  if (isLoading && !isPublicPath) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy/10 text-burgundy shadow-inner">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
        <p className="text-sm font-semibold text-brown-700 font-display tracking-wide">
          Verifying ReTech Session...
        </p>
      </div>
    );
  }

  // Block protected content if not authenticated
  if (!isAuthenticated && !isPublicPath) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-cream-50 text-center">
        <div className="max-w-md w-full rounded-2xl border border-cream-300 bg-white p-8 shadow-warm space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
            <Lock className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-brown-950 font-display">
              Authentication Required
            </h2>
            <p className="text-xs text-brown-600 leading-relaxed">
              Please sign in or create an account to access the marketplace, cart, and device verification records.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link href={`/?redirect=${encodeURIComponent(pathname)}`}>
              <Button variant="primary" size="lg" className="w-full shadow-warm">
                Sign In to Continue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!hideLayout && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
