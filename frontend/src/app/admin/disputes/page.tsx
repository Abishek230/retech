"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDispute, setActiveDispute] = useState<any | null>(null);
  const [actionType, setActionType] = useState<"REFUND_BUYER" | "RELEASE_SELLER" | "PARTIAL_REFUND">("REFUND_BUYER");
  const [refundAmount, setRefundAmount] = useState<string>("50");
  const [resolutionNote, setResolutionNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const fetchDisputes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/admin/disputes`);
      if (res.ok) {
        const json = await res.json();
        setDisputes(json.data || []);
      }
    } catch {
      // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async () => {
    if (!activeDispute) return;
    setIsSubmitting(true);
    try {
      await fetch(`${API_BASE}/admin/disputes/${activeDispute.id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          refundAmount: parseFloat(refundAmount) || 0,
          resolutionNote: resolutionNote || `Arbitrated as ${actionType} by Platform Admin.`,
        }),
      });

      setDisputes((prev) =>
        prev.map((d) =>
          d.id === activeDispute.id ? { ...d, status: `RESOLVED_${actionType}` } : d
        )
      );
      setActiveDispute(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div>
          <h1 className="text-2xl font-black text-brown-950 font-display">Escrow Dispute Arbitration</h1>
          <p className="text-brown-500">
            Adjudicate buyer claims, inspect seller diagnostic counter-evidence, and execute binding escrow payouts.
          </p>
        </div>

        <Badge variant="burgundy">{disputes.length} Active Tickets</Badge>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-burgundy mx-auto" />
          <p className="text-brown-600 mt-2 font-semibold">Loading escrow dispute tickets...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <Card key={d.id} className="border-cream-300 bg-white p-6 shadow-warm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-burgundy" />
                  <span className="font-bold text-brown-950 font-display text-sm">
                    Dispute Ticket #{d.id}
                  </span>
                  <span className="text-[10px] text-brown-500 font-mono">
                    Order: {d.orderId} • {d.createdAt}
                  </span>
                </div>

                <Badge variant={d.status === "OPEN" ? "burgundy" : "pristine"}>
                  {d.status}
                </Badge>
              </div>

              {/* Hardware & Financial Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-cream-50 p-3.5 rounded-2xl border border-cream-200">
                <div>
                  <span className="text-[10px] text-brown-400 font-bold uppercase block">Hardware SKU</span>
                  <strong className="text-xs text-brown-950">{d.deviceTitle}</strong>
                </div>

                <div>
                  <span className="text-[10px] text-brown-400 font-bold uppercase block">Escrow Amount</span>
                  <strong className="text-xs font-mono font-black text-burgundy">
                    {formatPrice(d.orderAmount)}
                  </strong>
                </div>

                <div>
                  <span className="text-[10px] text-brown-400 font-bold uppercase block">Dispute Cause</span>
                  <strong className="text-xs text-brown-900 font-mono">{d.reason}</strong>
                </div>
              </div>

              {/* Claims Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Buyer Claim */}
                <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-red-800 font-bold text-[11px]">
                    <span>Buyer Claim ({d.buyerName})</span>
                    <span className="text-[9px] uppercase font-mono">Evidence Attached</span>
                  </div>
                  <p className="text-brown-800 leading-relaxed text-[11px]">{d.buyerClaim}</p>
                </div>

                {/* Seller Response */}
                <div className="rounded-2xl border border-cream-300 bg-cream-50/80 p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-brown-900 font-bold text-[11px]">
                    <span>Seller Statement ({d.sellerName})</span>
                    <span className="text-[9px] uppercase font-mono">Refurbisher Lab</span>
                  </div>
                  <p className="text-brown-800 leading-relaxed text-[11px]">{d.sellerResponse}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {d.status === "OPEN" && (
                <div className="flex flex-wrap items-center justify-end gap-2 border-t border-cream-200 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-700 border-red-300 hover:bg-red-50"
                    onClick={() => {
                      setActiveDispute(d);
                      setActionType("REFUND_BUYER");
                    }}
                  >
                    Full Refund to Buyer ({formatPrice(d.orderAmount)})
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setActiveDispute(d);
                      setActionType("PARTIAL_REFUND");
                    }}
                  >
                    Partial Settlement
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setActiveDispute(d);
                      setActionType("RELEASE_SELLER");
                    }}
                  >
                    Release Escrow to Seller
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      <Modal
        isOpen={!!activeDispute}
        onClose={() => setActiveDispute(null)}
        title="Execute Binding Escrow Settlement"
      >
        <div className="space-y-4 text-xs">
          <p className="text-brown-700 leading-relaxed">
            You are executing <strong className="text-burgundy">{actionType}</strong> for dispute on order{" "}
            <strong className="font-mono text-brown-900">{activeDispute?.orderId}</strong>.
          </p>

          {actionType === "PARTIAL_REFUND" && (
            <div>
              <label className="block text-[11px] font-bold text-brown-700 uppercase mb-1">
                Partial Refund Amount ($ USD)
              </label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-brown-900 font-mono font-bold"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-brown-700 uppercase mb-1">
              Arbitration Finding Note (Visible to both parties)
            </label>
            <textarea
              rows={3}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              placeholder="Explain the findings from diagnostic logs and terms..."
              className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-brown-900 focus:border-burgundy focus:outline-none"
            />
          </div>

          <Button
            variant="primary"
            size="md"
            className="w-full"
            isLoading={isSubmitting}
            onClick={handleResolve}
          >
            Confirm Binding Decision & Transfer Payout
          </Button>
        </div>
      </Modal>
    </div>
  );
}
