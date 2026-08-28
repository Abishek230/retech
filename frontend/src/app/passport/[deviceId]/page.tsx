"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { PassportSummary } from "@/components/passport/PassportSummary";
import { PassportTimeline } from "@/components/passport/PassportTimeline";
import { QrCodeWidget } from "@/components/passport/QrCodeWidget";
import { AdminVerifyModal } from "@/components/passport/AdminVerifyModal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  FileDown,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Lock,
  Sparkles,
  QrCode,
  Loader2,
  Settings,
} from "lucide-react";

export default function PassportPage() {
  const params = useParams();
  const router = useRouter();
  const deviceId = String(params.deviceId);
  const { user } = useAuth();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["digital_passport", deviceId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/passport/${deviceId}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load Digital Life Passport");
      return res.json();
    },
    enabled: !!deviceId,
  });

  const passport = data?.data;

  const handleDownloadPdf = async () => {
    if (!passport) return;
    try {
      setIsDownloadingPdf(true);
      const res = await fetch(`${API_BASE}/passport/${passport.id}/pdf`);
      if (!res.ok) throw new Error("Failed to generate PDF certificate");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `retech-passport-${passport.device?.brand || "device"}-${passport.id.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Error generating PDF certificate: " + err.message);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-sm font-semibold text-brown-700">
          Decrypting Digital Life Passport™ Records...
        </p>
      </div>
    );
  }

  if (isError || !passport) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-cream-50">
        <div className="max-w-md text-center rounded-2xl border border-cream-300 bg-white p-8 shadow-warm">
          <h2 className="text-xl font-bold text-brown-900 font-display">Passport Not Found</h2>
          <p className="text-xs text-brown-600 mt-2 mb-6">
            No permanent Digital Life Passport record is associated with device ID {deviceId}.
          </p>
          <Button variant="primary" size="sm" onClick={() => router.push("/marketplace")}>
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const isVerified = !!passport.verifiedAt;

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Top Banner */}
      <div className="border-b border-cream-200 bg-white/80 py-4 backdrop-blur-sm sticky top-14 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brown-700 hover:text-burgundy"
            >
              <ArrowLeft className="h-4 w-4" /> Marketplace
            </Link>
            <span className="text-cream-300">|</span>
            <Badge variant={isVerified ? "pristine" : "brown"} dot>
              {isVerified ? "Verified Authenticity Seal" : "Pending Quality Seal"}
            </Badge>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadPdf}
              isLoading={isDownloadingPdf}
              leftIcon={<FileDown className="h-4 w-4" />}
            >
              Download PDF Certificate
            </Button>

            {/* Admin Verification Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdminModalOpen(true)}
              leftIcon={<Settings className="h-4 w-4" />}
            >
              Admin Audit
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Device Summary Card */}
        <PassportSummary passport={passport} />

        {/* Main Grid: Left Timeline + Right QR & Cryptographic Seal */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left 8 Cols: Full Event Timeline */}
          <div className="lg:col-span-8 rounded-2xl border border-cream-300 bg-white p-6 sm:p-8 shadow-warm">
            <PassportTimeline entries={passport.entries || []} />
          </div>

          {/* Right 4 Cols: QR Widget + Trust Seals */}
          <div className="lg:col-span-4 space-y-6">
            <QrCodeWidget qrDataUrl={passport.qrCode} deviceId={passport.deviceId} />

            {/* DoD Data Wipe Guarantee Card */}
            <Card className="border-cream-300 bg-gradient-to-br from-cream-100 to-cream-50 p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-brown-900 font-display">
                <Lock className="h-4 w-4 text-burgundy" /> DoD 5220.22-M Compliance
              </div>
              <p className="text-brown-600 leading-relaxed">
                Prior owner data has been mathematically obliterated using 3-pass NIST and DoD standard sanitization protocols.
              </p>
              <div className="flex items-center justify-between border-t border-cream-200 pt-2 text-[10px] text-brown-500 font-mono">
                <span>Sanitization ID: DOW-9842</span>
                <span className="text-emerald-700 font-bold">100% Pass</span>
              </div>
            </Card>

            {/* 12-Month Guarantee Seal */}
            <Card className="border-cream-300 bg-white p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-brown-900 font-display">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> ReTech 12-Month Guarantee
              </div>
              <p className="text-brown-600 leading-relaxed">
                Covers all electrical, sensor, and battery degradation below 80% for 365 calendar days.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Admin Verification Modal */}
      <AdminVerifyModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        passportId={passport.id}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
