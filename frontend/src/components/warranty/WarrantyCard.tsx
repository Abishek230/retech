"use client";

import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Clock, AlertTriangle, Send, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

interface WarrantyCardProps {
  warrantyId: string;
  orderId: string;
  durationMonths: number;
  tier?: string;
  status: "ACTIVE" | "EXPIRED" | "CLAIMED";
  expiresAt: string;
  terms: string;
  daysRemaining?: number;
  deviceTitle?: string;
  onClaimSubmitted?: () => void;
}

export function WarrantyCard({
  warrantyId,
  orderId,
  durationMonths,
  tier = "PREMIUM",
  status,
  expiresAt,
  terms,
  daysRemaining = 365,
  deviceTitle,
  onClaimSubmitted,
}: WarrantyCardProps) {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [claimType, setClaimType] = useState<string>("BATTERY_DEGRADATION");
  const [issueDescription, setIssueDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await fetch(`${API_BASE}/warranty/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warrantyId,
          claimType,
          issueDescription,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit claim.");
      }

      setClaimSuccess(true);
      if (onClaimSubmitted) onClaimSubmitted();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpired = status === "EXPIRED" || daysRemaining <= 0;

  return (
    <>
      <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-cream-200 pb-3">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                status === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-700"
                  : status === "CLAIMED"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brown-950 font-display">
                {tier === "PREMIUM" ? "12-Month Premium Warranty" : "6-Month Standard Warranty"}
              </h4>
              {deviceTitle && <p className="text-[10px] text-brown-500">{deviceTitle}</p>}
            </div>
          </div>

          <Badge
            variant={status === "ACTIVE" ? "pristine" : status === "CLAIMED" ? "brown" : "burgundy"}
          >
            {status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 bg-cream-50/70 p-3 rounded-xl border border-cream-200">
          <div>
            <span className="text-[10px] text-brown-400 font-bold uppercase block">
              Expiration Date
            </span>
            <strong className="text-xs text-brown-900 font-mono">
              {new Date(expiresAt).toLocaleDateString()}
            </strong>
          </div>

          <div>
            <span className="text-[10px] text-brown-400 font-bold uppercase block">
              Coverage Status
            </span>
            <strong
              className={`text-xs font-mono font-bold ${
                status === "ACTIVE" ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {status === "ACTIVE" ? `${daysRemaining} Days Left` : status}
            </strong>
          </div>
        </div>

        <p className="text-brown-600 text-[11px] leading-relaxed">{terms}</p>

        {status === "ACTIVE" && (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-brown-300"
            onClick={() => setIsClaimModalOpen(true)}
          >
            File Warranty Claim / Repair Request
          </Button>
        )}
      </Card>

      {/* Claim Modal */}
      <Modal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        title="File Certified Warranty Claim"
      >
        {claimSuccess ? (
          <div className="py-6 text-center text-xs space-y-3">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-brown-950 font-display text-sm">
              Claim Registered Successfully!
            </h4>
            <p className="text-brown-600">
              Our technician team will review your diagnostic ticket and issue prepaid return transit within 24 hours.
            </p>
            <Button variant="primary" size="sm" onClick={() => setIsClaimModalOpen(false)}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-[11px]">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-brown-700 uppercase mb-1">
                Claim Reason
              </label>
              <select
                value={claimType}
                onChange={(e) => setClaimType(e.target.value)}
                className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-brown-900 bg-white"
              >
                <option value="BATTERY_DEGRADATION">Battery Retention Loss (&lt;80%)</option>
                <option value="SENSOR_FAILURE">Camera / Sensor Optical Defect</option>
                <option value="OPTICAL_SCRATCH">Subpixel Display Line / Flicker</option>
                <option value="HARDWARE_DEFECT">Port / Board Hardware Defect</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brown-700 uppercase mb-1">
                Describe the Issue
              </label>
              <textarea
                rows={3}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Explain the symptom, when it started, and any error messages..."
                className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-brown-900 focus:border-burgundy focus:outline-none"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
              isLoading={isSubmitting}
              rightIcon={<Send className="h-3.5 w-3.5" />}
            >
              Submit Warranty Claim
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
