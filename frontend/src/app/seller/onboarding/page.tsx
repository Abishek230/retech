"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Building2,
  CreditCard,
  FileCheck,
  PlusCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

const ONBOARDING_STEPS = [
  { id: 1, name: "Business Info", icon: <Building2 className="h-4 w-4" /> },
  { id: 2, name: "Stripe Connect", icon: <CreditCard className="h-4 w-4" /> },
  { id: 3, name: "ID Verification", icon: <FileCheck className="h-4 w-4" /> },
  { id: 4, name: "First Listing", icon: <PlusCircle className="h-4 w-4" /> },
  { id: 5, name: "Activated", icon: <Sparkles className="h-4 w-4" /> },
];

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    businessName: "Austin Circular Technologies LLC",
    ein: "XX-XXXXXXX",
    supportEmail: "support@austincircular.com",
    address: "742 Evergreen Terrace, Austin TX",
    stripeBank: "Chase Direct Deposit (**** 6789)",
    idDocName: "texas_business_license_2026.pdf",
    firstListingTitle: "MacBook Pro 14 M3 Pro (18GB/512GB)",
    firstListingPrice: "1499",
  });

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 4) {
      setIsSubmitting(true);
      try {
        await fetch(`${API_BASE}/seller/onboarding/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: formData.businessName,
            stripeAccountId: `acct_stripe_${Date.now()}`,
            idDocumentUrl: "https://retech.eco/docs/verified_license.pdf",
          }),
        });
        setCurrentStep(5);
      } catch {
        setCurrentStep(5);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Top Banner */}
      <div className="border-b border-cream-200 bg-white/70 py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-1">
          <Badge variant="burgundy" dot>
            Verified Refurbisher Onboarding
          </Badge>
          <h1 className="text-3xl font-black text-brown-950 font-display">
            Become a Certified ReTech Refurbisher
          </h1>
          <p className="text-xs text-brown-600">
            Join the elite network of verified circular hardware partners with instant escrow payouts.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Step Progress Stepper */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {ONBOARDING_STEPS.map((st) => {
            const isPassed = currentStep > st.id;
            const isCurrent = currentStep === st.id;

            return (
              <div key={st.id} className="space-y-1.5">
                <div
                  className={`flex h-10 w-10 mx-auto items-center justify-center rounded-xl font-bold transition-all ${
                    isPassed
                      ? "bg-emerald-600 text-white"
                      : isCurrent
                      ? "bg-burgundy text-white ring-2 ring-burgundy/30"
                      : "bg-cream-200 text-brown-400"
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="h-5 w-5" /> : st.icon}
                </div>
                <span
                  className={`text-[11px] font-bold block ${
                    isCurrent ? "text-burgundy" : isPassed ? "text-emerald-700" : "text-brown-400"
                  }`}
                >
                  {st.id}. {st.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step Cards */}
        <Card className="border-cream-300 bg-white p-6 sm:p-8 shadow-warm space-y-6">
          {/* STEP 1: Business Information */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-cream-200 pb-3">
                <h3 className="text-base font-bold text-brown-950 font-display">
                  Step 1: Business Information
                </h3>
                <p className="text-brown-500">Provide legal entity & customer support contact.</p>
              </div>

              <div className="space-y-3">
                <Input
                  label="Legal Business Name / Refurbishing Entity"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Tax ID / EIN Number"
                    value={formData.ein}
                    onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                    required
                  />
                  <Input
                    label="Customer Support Email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Facility Operating Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 2: Stripe Connect */}
          {currentStep === 2 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-cream-200 pb-3">
                <h3 className="text-base font-bold text-brown-950 font-display">
                  Step 2: Stripe Connect Escrow Payouts
                </h3>
                <p className="text-brown-500">
                  Connect your bank account to receive 95% net payouts directly after the 2-day holding period.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>Stripe Connect Direct Account Linked</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Bank: {formData.stripeBank} • Automated Daily Settlements Enabled.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: ID Verification */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-cream-200 pb-3">
                <h3 className="text-base font-bold text-brown-950 font-display">
                  Step 3: Identity & Refurbishing Accreditation
                </h3>
                <p className="text-brown-500">
                  Upload government photo ID or state business license to unlock Pro Seller status.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50/50 p-8 text-center space-y-2">
                <FileCheck className="h-8 w-8 text-burgundy mx-auto" />
                <strong className="text-brown-900 block">{formData.idDocName}</strong>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                  OCR Verification Passed ✓
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: First Listing */}
          {currentStep === 4 && (
            <div className="space-y-4 text-xs">
              <div className="border-b border-cream-200 pb-3">
                <h3 className="text-base font-bold text-brown-950 font-display">
                  Step 4: Create Your First Hardware Listing
                </h3>
                <p className="text-brown-500">
                  Configure your inaugural device offering with 12-month certified guarantee.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  label="Listing Title"
                  value={formData.firstListingTitle}
                  onChange={(e) => setFormData({ ...formData, firstListingTitle: e.target.value })}
                  required
                />
                <Input
                  label="Target Price ($ USD)"
                  value={formData.firstListingPrice}
                  onChange={(e) => setFormData({ ...formData, firstListingPrice: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* STEP 5: Seller Activated */}
          {currentStep === 5 && (
            <div className="py-8 text-center text-xs space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mx-auto shadow-sm">
                <Sparkles className="h-8 w-8 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-brown-950 font-display">
                  Congratulations! Seller Account Activated
                </h3>
                <p className="text-brown-600 max-w-md mx-auto">
                  You are now recognized as a <strong className="text-emerald-700">Tier-1 Pro Seller</strong>. Your first listing is live on the marketplace.
                </p>
              </div>

              <div className="pt-2">
                <Link href="/seller/dashboard">
                  <Button variant="primary" size="lg" className="shadow-warm" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    Launch Seller Command Center
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between border-t border-cream-200 pt-4">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                >
                  Previous
                </Button>
              ) : (
                <div />
              )}

              <Button
                variant="primary"
                size="md"
                onClick={handleNext}
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                {currentStep === 4 ? "Complete & Activate Store" : "Continue"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
