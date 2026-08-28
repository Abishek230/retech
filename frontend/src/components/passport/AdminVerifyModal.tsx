"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { ShieldCheck, Plus, Check } from "lucide-react";

interface AdminVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  passportId: string;
  onSuccess: () => void;
}

export function AdminVerifyModal({
  isOpen,
  onClose,
  passportId,
  onSuccess,
}: AdminVerifyModalProps) {
  const [tab, setTab] = useState<"certify" | "entry">("certify");
  const [technicianName, setTechnicianName] = useState("Elena Rostova (Lead AI Assessor)");
  const [entryType, setEntryType] = useState<string>("INSPECTION");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/passport/${passportId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verifiedBy: technicianName }),
      });
      if (!res.ok) throw new Error("Failed to verify passport");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please provide a description of the event.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/passport/${passportId}/entry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: entryType,
          description,
          performedBy: technicianName,
          date: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error("Failed to add entry");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to add entry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Admin Passport Verification & Audit Log"
      description={`Passport ID: ${passportId} • Certify device or record maintenance event.`}
      className="max-w-lg"
    >
      <div className="space-y-5 pt-2 text-xs">
        {/* Switcher */}
        <div className="grid grid-cols-2 p-1 bg-cream-100 rounded-xl border border-cream-300">
          <button
            type="button"
            onClick={() => setTab("certify")}
            className={`py-1.5 font-bold rounded-lg transition-all ${
              tab === "certify" ? "bg-white text-burgundy shadow-sm" : "text-brown-600"
            }`}
          >
            Official Certification Seal
          </button>
          <button
            type="button"
            onClick={() => setTab("entry")}
            className={`py-1.5 font-bold rounded-lg transition-all ${
              tab === "entry" ? "bg-white text-burgundy shadow-sm" : "text-brown-600"
            }`}
          >
            Append Event Entry
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 font-semibold">
            {error}
          </div>
        )}

        {tab === "certify" ? (
          <div className="space-y-4">
            <Input
              label="Certifying Technician / Authority"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              required
            />

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 space-y-1">
              <strong className="block font-bold">Action Summary:</strong>
              <p>
                Mint official ReTech Circular Quality Certification stamp, update verifiedAt timestamp, and append official certification event.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleVerify}
                isLoading={isLoading}
                rightIcon={<ShieldCheck className="h-4 w-4" />}
              >
                Sign & Certify Passport
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brown-700 mb-1.5">
                Event Category
              </label>
              <select
                value={entryType}
                onChange={(e) => setEntryType(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-cream-50 p-2.5 text-xs font-semibold text-brown-900 focus:outline-none focus:ring-2 focus:ring-burgundy"
              >
                <option value="INSPECTION">INSPECTION</option>
                <option value="REPAIR">REPAIR</option>
                <option value="CERTIFICATION">CERTIFICATION</option>
                <option value="FACTORY_RESET">FACTORY RESET</option>
                <option value="OWNERSHIP">OWNERSHIP TRANSFER</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-brown-700 mb-1.5">
                Event Description & Hardware Findings
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Replaced display panel with OEM certified Apple Retina screen. Thermal dissipation tested at 45°C under maximum load."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-cream-300 bg-cream-50 p-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-burgundy"
                required
              />
            </div>

            <Input
              label="Technician / Engineer Signature"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              required
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isLoading}
                rightIcon={<Plus className="h-4 w-4" />}
              >
                Append to Permanent Log
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
