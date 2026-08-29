"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { OtpModal } from "@/components/auth/OtpModal";
import { GoogleEmailModal } from "@/components/auth/GoogleEmailModal";
import {
  RotateCcw,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User as UserIcon,
  Store,
  ShoppingBag,
  Check,
  Zap,
  Leaf,
  Cpu,
  Loader2,
} from "lucide-react";

function AuthHub() {
  const { user, login, register, sendOtp, verifyOtp, loginWithFirebaseGoogle, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");

  // Primary Tab: "login" or "register"
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login Mode: "password" or "otp"
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");

  // Google Email Modal state
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Form Fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerRole, setRegisterRole] = useState<UserRole>("BUYER");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerBusinessName, setRegisterBusinessName] = useState("");

  // Alerts & Modals
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpPurpose, setOtpPurpose] = useState<"LOGIN" | "REGISTRATION">("LOGIN");
  const [otpTargetEmail, setOtpTargetEmail] = useState("");

  // Password validation
  const hasMinLength = registerPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(registerPassword);
  const hasNumber = /\d/.test(registerPassword);
  const isRegisterPasswordValid = hasMinLength && hasUppercase && hasNumber;

  const getDestination = (loggedInUser?: any) => {
    if (redirectParam && redirectParam.startsWith("/") && redirectParam !== "/" && redirectParam !== "/login") {
      return redirectParam;
    }
    const role = loggedInUser?.role || user?.role;
    if (role === "SELLER") return "/seller/dashboard";
    if (role === "ADMIN") return "/admin";
    return "/marketplace";
  };

  // Auto-route if already authenticated
  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getDestination(user));
    }
  }, [user, isLoading]);

  // Handle Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail || !loginPassword) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    const res = await login(loginEmail, loginPassword);
    if (res.success) {
      router.push(getDestination(res.user));
    } else {
      setErrorMessage(res.error || "Authentication failed. Please verify your credentials.");
    }
  };

  // Quick Demo Login Handler
  const handleQuickLogin = async (email: string, role: string) => {
    setErrorMessage(null);
    setSuccessMessage(`Logging in as ${role}...`);
    setLoginEmail(email);
    setLoginPassword("Password123!");
    const res = await login(email, "Password123!");
    if (res.success) {
      router.push(getDestination(res.user));
    } else {
      setErrorMessage(res.error || "Demo login failed.");
      setSuccessMessage(null);
    }
  };

  // Handle Send OTP for Login
  const handleSendLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!loginEmail) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    const res = await sendOtp(loginEmail, "LOGIN");
    if (res.success) {
      setOtpTargetEmail(loginEmail);
      setOtpPurpose("LOGIN");
      setIsOtpModalOpen(true);
    } else {
      setErrorMessage(res.error || "Failed to dispatch OTP passcode.");
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!registerName || !registerEmail || !registerPassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!isRegisterPasswordValid) {
      setErrorMessage("Please fulfill all password security requirements.");
      return;
    }

    if (registerRole === "SELLER" && !registerBusinessName.trim()) {
      setErrorMessage("Please specify your business or store name.");
      return;
    }

    const res = await register({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      role: registerRole,
      businessName: registerRole === "SELLER" ? registerBusinessName : undefined,
    });

    if (res.success) {
      setOtpTargetEmail(registerEmail);
      setOtpPurpose("REGISTRATION");
      setIsOtpModalOpen(true);
    } else {
      setErrorMessage(res.error || "Registration failed. Please try again.");
    }
  };

  // Handle Google Auth (Prompts for email before connecting)
  const handleGoogleAuth = () => {
    setErrorMessage(null);
    setIsGoogleModalOpen(true);
  };

  const handleConfirmGoogleEmail = async (googleEmail: string) => {
    const roleToUse = activeTab === "register" ? registerRole : "BUYER";
    const res = await loginWithFirebaseGoogle(googleEmail, roleToUse, roleToUse === "SELLER" ? registerBusinessName : undefined);
    if (res.success && res.user) {
      setIsGoogleModalOpen(false);
      router.replace(getDestination(res.user));
      return { success: true };
    } else {
      return { success: false, error: res.error || "Google authentication failed. Please try again." };
    }
  };

  return (
    <div className="min-h-[92vh] flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-b from-cream-100 via-cream-50 to-cream">
      <div className="w-full max-w-lg space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy text-white shadow-warm">
              <RotateCcw className="h-6 w-6 text-cream" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-brown-950 font-display">
            Re<span className="text-burgundy">Tech</span> Platform
          </h1>
          <p className="text-xs sm:text-sm text-brown-600 max-w-md mx-auto">
            AI-Certified Circular Electronics Marketplace with Digital Life Passports.
          </p>
        </div>

        {/* Auth Box */}
        <Card className="border-cream-300 shadow-warm-lg bg-white/95 backdrop-blur-sm overflow-hidden">
          {/* Top Switcher: Sign In vs Create Account */}
          <div className="grid grid-cols-2 p-1.5 bg-cream-100/90 border-b border-cream-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "login"
                  ? "bg-white text-burgundy shadow-sm"
                  : "text-brown-600 hover:text-brown-950"
              }`}
            >
              <Zap className="h-3.5 w-3.5" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "register"
                  ? "bg-white text-burgundy shadow-sm"
                  : "text-brown-600 hover:text-brown-950"
              }`}
            >
              <UserIcon className="h-3.5 w-3.5" /> Create Account
            </button>
          </div>

          <CardContent className="space-y-4 p-6">
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

            {/* Google Authentication Button */}
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full justify-center gap-3 bg-white hover:bg-cream-50 text-brown-900 border-cream-300 shadow-sm"
              onClick={handleGoogleAuth}
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
              {activeTab === "login" ? "Continue with Google" : "Sign Up with Google"}
            </Button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-cream-300 w-full" />
              <span className="bg-white px-3 text-[10px] uppercase tracking-wider text-brown-400 font-bold absolute">
                or with email
              </span>
            </div>

            {/* TAB 1: SIGN IN */}
            {activeTab === "login" && (
              <div className="space-y-4">
                {/* Secondary login mode: Password vs OTP */}
                <div className="flex rounded-lg bg-cream-50 p-1 border border-cream-200 text-[11px] font-semibold text-brown-600">
                  <button
                    type="button"
                    onClick={() => setLoginMode("password")}
                    className={`flex-1 py-1.5 rounded text-center transition-all ${
                      loginMode === "password" ? "bg-white text-burgundy shadow-sm font-bold" : "hover:text-brown-900"
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode("otp")}
                    className={`flex-1 py-1.5 rounded text-center transition-all ${
                      loginMode === "otp" ? "bg-white text-burgundy shadow-sm font-bold" : "hover:text-brown-900"
                    }`}
                  >
                    Email OTP Passcode
                  </button>
                </div>

                {loginMode === "password" ? (
                  <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="e.g. alex.rivera@retech.eco"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      leftIcon={<Mail className="h-4 w-4" />}
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      placeholder="••••••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      leftIcon={<Lock className="h-4 w-4" />}
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full shadow-warm"
                      isLoading={isLoading}
                      rightIcon={<ArrowRight className="h-4 w-4" />}
                    >
                      Sign In to Platform
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleSendLoginOtp} className="space-y-3.5">
                    <Input
                      label="Registered Email"
                      type="email"
                      placeholder="e.g. alex.rivera@retech.eco"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      helperText="We will send a 6-digit security code directly to your email inbox."
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

                {/* 1-Click Quick Demo Switcher */}
                <div className="pt-2 border-t border-cream-200">
                  <p className="text-[11px] font-bold text-brown-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-burgundy" /> Quick 1-Click Demo Login
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin("alex.rivera@retech.eco", "Buyer")}
                      className="p-2 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-100 text-left transition-all group"
                    >
                      <span className="text-[11px] font-bold text-brown-900 block group-hover:text-burgundy">
                        🛒 Buyer
                      </span>
                      <span className="text-[10px] text-brown-500 font-mono">Marketplace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin("greencircuit@seller.retech.eco", "Seller")}
                      className="p-2 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-100 text-left transition-all group"
                    >
                      <span className="text-[11px] font-bold text-brown-900 block group-hover:text-burgundy">
                        🏪 Seller
                      </span>
                      <span className="text-[10px] text-brown-500 font-mono">Dashboard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin("admin@retech.eco", "Admin")}
                      className="p-2 rounded-xl border border-cream-300 bg-cream-50 hover:bg-cream-100 text-left transition-all group"
                    >
                      <span className="text-[11px] font-bold text-brown-900 block group-hover:text-burgundy">
                        🛡️ Admin
                      </span>
                      <span className="text-[10px] text-brown-500 font-mono">Control</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CREATE ACCOUNT */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister} className="space-y-3.5">
                {/* Account Type Selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-brown-600 block mb-1.5">
                    Account Role
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRegisterRole("BUYER")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        registerRole === "BUYER"
                          ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy"
                          : "border-cream-300 bg-white hover:bg-cream-50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="h-4 w-4 text-burgundy" />
                        <span className="text-xs font-bold text-brown-950">Buyer</span>
                      </div>
                      <p className="text-[10px] text-brown-500 mt-0.5">Shop refurbished devices</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegisterRole("SELLER")}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        registerRole === "SELLER"
                          ? "border-burgundy bg-burgundy/5 ring-1 ring-burgundy"
                          : "border-cream-300 bg-white hover:bg-cream-50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Store className="h-4 w-4 text-burgundy" />
                        <span className="text-xs font-bold text-brown-950">Refurbisher</span>
                      </div>
                      <p className="text-[10px] text-brown-500 mt-0.5">Sell & verify tech</p>
                    </button>
                  </div>
                </div>

                <Input
                  label="Full Name"
                  placeholder="e.g. Maya Lin"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  leftIcon={<UserIcon className="h-4 w-4" />}
                  required
                />

                {registerRole === "SELLER" && (
                  <Input
                    label="Business / Store Name"
                    placeholder="e.g. Apex Silicon Labs"
                    value={registerBusinessName}
                    onChange={(e) => setRegisterBusinessName(e.target.value)}
                    leftIcon={<Store className="h-4 w-4" />}
                    required
                  />
                )}

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="e.g. maya@retech.eco"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  leftIcon={<Mail className="h-4 w-4" />}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  leftIcon={<Lock className="h-4 w-4" />}
                  required
                />

                {/* Password Requirements */}
                <div className="rounded-xl border border-cream-200 bg-cream-50/70 p-2.5 space-y-1 text-[11px] text-brown-600">
                  <div className="flex items-center gap-1.5">
                    <div className={`h-3 w-3 rounded-full flex items-center justify-center ${hasMinLength ? "bg-emerald-500 text-white" : "bg-cream-300"}`}>
                      {hasMinLength && <Check className="h-2 w-2" />}
                    </div>
                    <span className={hasMinLength ? "text-emerald-800 font-semibold" : ""}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-3 w-3 rounded-full flex items-center justify-center ${hasUppercase && hasNumber ? "bg-emerald-500 text-white" : "bg-cream-300"}`}>
                      {hasUppercase && hasNumber && <Check className="h-2 w-2" />}
                    </div>
                    <span className={hasUppercase && hasNumber ? "text-emerald-800 font-semibold" : ""}>Uppercase letter & number</span>
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
                  Create {registerRole === "SELLER" ? "Seller" : "Buyer"} Account
                </Button>
              </form>
            )}
          </CardContent>

          {/* Footer: Direct Guest Marketplace Link */}
          <CardFooter className="justify-between border-t border-cream-200 bg-cream-50/60 py-3.5 px-6 text-xs text-brown-600">
            <span>Want to explore first?</span>
            <Link href="/marketplace" className="font-bold text-burgundy hover:underline flex items-center gap-1">
              Browse Marketplace as Guest <ArrowRight className="h-3 w-3" />
            </Link>
          </CardFooter>
        </Card>

        {/* Feature Highlights */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs text-brown-700">
          <div className="flex flex-col items-center gap-1">
            <Cpu className="h-4 w-4 text-burgundy" />
            <span className="font-semibold text-[11px]">AI Diagnostic Scores</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-700" />
            <span className="font-semibold text-[11px]">12-Month Warranty</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Leaf className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold text-[11px]">CO₂ Carbon Tracking</span>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={otpTargetEmail}
        purpose={otpPurpose}
        onSuccess={() => {
          setIsOtpModalOpen(false);
          router.push(registerRole === "SELLER" ? "/seller/dashboard" : "/marketplace");
        }}
        onVerify={async (otp) => {
          return await verifyOtp(otpTargetEmail, otp, otpPurpose);
        }}
        onResend={async () => {
          return await sendOtp(otpTargetEmail, otpPurpose);
        }}
      />

      {/* Google Email Verification Modal */}
      <GoogleEmailModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        initialEmail={activeTab === "register" ? registerEmail : loginEmail}
        onConfirm={handleConfirmGoogleEmail}
      />
    </div>
  );
}

export default function RootPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-burgundy" />
          <p className="text-sm font-semibold text-brown-800">Loading ReTech Platform...</p>
        </div>
      }
    >
      <AuthHub />
    </Suspense>
  );
}


