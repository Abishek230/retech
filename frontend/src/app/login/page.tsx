"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { OtpModal } from "@/components/auth/OtpModal";
import { GoogleEmailModal } from "@/components/auth/GoogleEmailModal";
import { RotateCcw, Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Loader2 } from "lucide-react";

function LoginForm() {
  const { user, login, sendOtp, verifyOtp, loginWithFirebaseGoogle, setSessionFromToken, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const redirectUrl = searchParams.get("redirect");

  const getDestination = (loggedInUser?: any) => {
    if (redirectUrl && redirectUrl !== "/" && redirectUrl !== "/login") {
      return redirectUrl;
    }
    const role = loggedInUser?.role || user?.role;
    if (role === "SELLER") return "/seller/dashboard";
    if (role === "ADMIN") return "/admin";
    return "/marketplace";
  };

  // Check URL params for OAuth redirect callback tokens
  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setSessionFromToken(tokenFromUrl).then(() => {
        router.replace(getDestination());
      });
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getDestination(user));
    }
  }, [user, isLoading]);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage("Please enter both your email address and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      router.push(getDestination(res.user));
    } else {
      setErrorMessage(res.error || "Authentication failed. Please verify your credentials.");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage("Please enter your email address to receive an OTP.");
      return;
    }

    const res = await sendOtp(email, "LOGIN");
    if (res.success) {
      setIsOtpModalOpen(true);
    } else {
      setErrorMessage(res.error || "Failed to dispatch OTP passcode.");
    }
  };

  const handleGoogleLogin = () => {
    setErrorMessage(null);
    setIsGoogleModalOpen(true);
  };

  const handleConfirmGoogleEmail = async (googleEmail: string) => {
    const res = await loginWithFirebaseGoogle(googleEmail, "BUYER");
    if (res.success && res.user) {
      setIsGoogleModalOpen(false);
      const destination = getDestination(res.user);
      window.location.href = destination;
      return { success: true };
    } else {
      return { success: false, error: res.error || "Google authentication failed. Please try again." };
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Icon Header */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-burgundy text-white shadow-warm transition-transform group-hover:scale-105">
            <RotateCcw className="h-6 w-6 text-cream" />
          </div>
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-brown-950 font-display">
          Welcome back to Re<span className="text-burgundy">Tech</span>
        </h1>
        <p className="text-xs text-brown-600">
          Sign in to access your verified refurbished dashboard & digital passports.
        </p>
      </div>

      <Card className="border-cream-300 shadow-warm-lg bg-white/95 backdrop-blur-sm">
        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-cream-100/90 rounded-xl mb-4 border border-cream-200">
          <button
            type="button"
            onClick={() => {
              setAuthMode("password");
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === "password"
                ? "bg-white text-burgundy shadow-sm"
                : "text-brown-600 hover:text-brown-900"
            }`}
          >
            Password Login
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode("otp");
              setErrorMessage(null);
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              authMode === "otp"
                ? "bg-white text-burgundy shadow-sm"
                : "text-brown-600 hover:text-brown-900"
            }`}
          >
            Email OTP Passcode
          </button>
        </div>

        <CardContent className="space-y-4 pt-2">
          {/* Feedback Alerts */}
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
              {successMessage}
            </div>
          )}

          {/* Google OAuth Login Button */}
          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full justify-center gap-3 bg-white hover:bg-cream-50 text-brown-900 border-cream-300"
            onClick={handleGoogleLogin}
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
            Continue with Google
          </Button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-cream-300 w-full" />
            <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-brown-400 font-semibold absolute">
              or with email
            </span>
          </div>

          {/* Mode 1: Standard Password Login */}
          {authMode === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
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

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-brown-700">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-cream-300 text-burgundy focus:ring-burgundy"
                  />
                  <span>Remember 7-day session</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("otp");
                    setSuccessMessage("Switched to OTP mode: Enter your email to receive a login passcode.");
                  }}
                  className="font-semibold text-burgundy hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full shadow-warm"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Sign In
              </Button>
            </form>
          ) : (
            /* Mode 2: Passwordless OTP Login */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="e.g. sarah@retech.eco"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="We will send a 6-digit security code directly to your inbox."
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ShieldCheck className="h-4 w-4" />}
              >
                Send One-Time Passcode
              </Button>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t border-cream-200 bg-cream-50/50 py-4 text-xs text-brown-700">
          <span>New to the circular marketplace?</span>
          <Link href="/register" className="ml-1.5 font-bold text-burgundy hover:underline">
            Create an account
          </Link>
        </CardFooter>
      </Card>

      {/* Demo Credentials Helper Card */}
      <div className="rounded-xl border border-cream-300 bg-cream-100/70 p-3.5 text-xs text-brown-700">
        <p className="font-bold text-brown-900 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-burgundy" /> Demo Accounts (Password: Password123!)
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
          <div>
            <span className="font-semibold text-burgundy">Admin:</span> admin@retech.eco
          </div>
          <div>
            <span className="font-semibold text-brown-800">Seller:</span> greencircuit@seller.retech.eco
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={email}
        purpose="LOGIN"
        onSuccess={() => {
          router.push(getDestination());
        }}
        onVerify={async (otp) => {
          return await verifyOtp(email, otp, "LOGIN");
        }}
        onResend={async () => {
          return await sendOtp(email, "LOGIN");
        }}
      />

      {/* Google Email Verification Modal */}
      <GoogleEmailModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        initialEmail={email}
        onConfirm={handleConfirmGoogleEmail}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-cream-100 via-cream-50 to-cream">
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-burgundy" />
            <p className="text-sm font-medium text-brown-700">Loading sign in portal...</p>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
