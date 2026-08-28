"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  RotateCcw,
  Mail,
  Lock,
  User as UserIcon,
  Store,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
} from "lucide-react";

export default function RegisterPage() {
  const { register, loginWithFirebaseGoogle, isLoading } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("BUYER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password requirements state
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasNumber;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name || !email || !password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (!isPasswordValid) {
      setErrorMessage("Please fulfill all password security requirements.");
      return;
    }

    if (role === "SELLER" && !businessName.trim()) {
      setErrorMessage("Please specify your business or store name.");
      return;
    }

    const res = await register({
      name,
      email: email.trim(),
      password,
      role,
      businessName: role === "SELLER" ? businessName : undefined,
    });

    if (res.success) {
      // Direct account creation & redirect without OTP verification
      if (role === "SELLER") {
        router.push("/seller/dashboard");
      } else {
        router.push("/marketplace");
      }
    } else {
      setErrorMessage(res.error || "Registration failed. Please try again.");
    }
  };

  const handleGoogleSignup = async () => {
    setErrorMessage(null);
    const res = await loginWithFirebaseGoogle(role, role === "SELLER" ? businessName : undefined);
    if (res.success) {
      if (role === "SELLER") {
        router.push("/seller/dashboard");
      } else {
        router.push("/marketplace");
      }
    } else {
      setErrorMessage(res.error || "Firebase authentication failed.");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-cream-100 via-cream-50 to-cream">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Icon Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-burgundy text-white shadow-warm transition-transform group-hover:scale-105">
              <RotateCcw className="h-6 w-6 text-cream" />
            </div>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-brown-950 font-display">
            Join the Circular Revolution
          </h1>
          <p className="text-xs text-brown-600">
            Create an account on ReTech to trade, purchase, or certify refurbished electronics.
          </p>
        </div>

        <Card className="border-cream-300 shadow-warm-lg bg-white/95 backdrop-blur-sm">
          {/* Role Toggle: Buyer vs Seller */}
          <div className="p-4 border-b border-cream-200">
            <p className="text-xs font-bold uppercase tracking-wider text-brown-500 mb-2">
              Select Account Role
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Buyer Card */}
              <button
                type="button"
                onClick={() => setRole("BUYER")}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  role === "BUYER"
                    ? "border-burgundy bg-burgundy/5 ring-2 ring-burgundy/20"
                    : "border-cream-300 bg-cream-50 hover:bg-cream-100 text-brown-700"
                }`}
              >
                <div className={`p-2 rounded-lg ${role === "BUYER" ? "bg-burgundy text-white" : "bg-cream-200 text-brown-700"}`}>
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-brown-900">Buyer Account</div>
                  <div className="text-[11px] text-brown-600">Buy certified gear & trade in</div>
                </div>
              </button>

              {/* Seller Card */}
              <button
                type="button"
                onClick={() => setRole("SELLER")}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  role === "SELLER"
                    ? "border-burgundy bg-burgundy/5 ring-2 ring-burgundy/20"
                    : "border-cream-300 bg-cream-50 hover:bg-cream-100 text-brown-700"
                }`}
              >
                <div className={`p-2 rounded-lg ${role === "SELLER" ? "bg-burgundy text-white" : "bg-cream-200 text-brown-700"}`}>
                  <Store className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-brown-900">Seller Account</div>
                  <div className="text-[11px] text-brown-600">List refurbished inventory</div>
                </div>
              </button>
            </div>
          </div>

          <CardContent className="space-y-4 pt-4">
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Google Signup */}
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full justify-center gap-3 bg-white hover:bg-cream-50 text-brown-900 border-cream-300"
              onClick={handleGoogleSignup}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              Sign up with Google as {role === "SELLER" ? "Seller" : "Buyer"}
            </Button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-cream-300 w-full" />
              <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-brown-400 font-semibold absolute">
                or sign up with email
              </span>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              <Input
                label="Full Name"
                placeholder="e.g. Sarah Connor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<UserIcon className="h-4 w-4" />}
                required
              />

              {role === "SELLER" && (
                <Input
                  label="Business / Refurbisher Store Name"
                  placeholder="e.g. Apex Silicon Labs"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  leftIcon={<Store className="h-4 w-4" />}
                  required
                />
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="e.g. sarah@retech.eco"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />

              {/* Password Requirement Checklist */}
              <div className="rounded-xl border border-cream-300 bg-cream-50/70 p-3 space-y-1.5 text-xs text-brown-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <div className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${hasMinLength ? "bg-emerald-500 text-white" : "bg-cream-300"}`}>
                    {hasMinLength && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span className={hasMinLength ? "text-emerald-800 font-semibold" : ""}>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <div className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${hasUppercase ? "bg-emerald-500 text-white" : "bg-cream-300"}`}>
                    {hasUppercase && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span className={hasUppercase ? "text-emerald-800 font-semibold" : ""}>At least one uppercase letter</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <div className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${hasNumber ? "bg-emerald-500 text-white" : "bg-cream-300"}`}>
                    {hasNumber && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span className={hasNumber ? "text-emerald-800 font-semibold" : ""}>At least one number</span>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-warm"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Create {role === "SELLER" ? "Seller" : "Buyer"} Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center border-t border-cream-200 bg-cream-50/50 py-4 text-xs text-brown-700">
            <span>Already have an account?</span>
            <Link href="/login" className="ml-1.5 font-bold text-burgundy hover:underline">
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
