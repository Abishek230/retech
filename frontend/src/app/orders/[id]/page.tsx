"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, getDeviceImageUrl } from "@/lib/utils";
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  FileDown,
  ArrowLeft,
  ExternalLink,
  Loader2,
  Calendar,
  MapPin,
  Check,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { generateInvoicePdf } from "@/lib/generateInvoicePdf";

const ORDER_STAGES = [
  { id: "PAID", title: "1. Payment Escrow Confirmed" },
  { id: "PROCESSING", title: "2. 42-Point QA Passed" },
  { id: "SHIPPED", title: "3. Dispatched in Transit" },
  { id: "DELIVERED", title: "4. Delivered & Verified" },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const { accessToken } = useAuth();
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order_detail", id, accessToken],
    queryFn: async () => {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        headers,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Order not found");
      return res.json();
    },
    enabled: !!id,
  });

  const order = data?.data;

  const handleDownloadInvoice = () => {
    if (!order) return;
    try {
      setDownloadingPdf(true);
      generateInvoicePdf(order);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("Error generating PDF invoice:", err);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 bg-cream-50">
        <Loader2 className="h-10 w-10 animate-spin text-burgundy" />
        <p className="text-sm font-semibold text-brown-700">Loading Order & Tracking...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 bg-cream-50">
        <div className="max-w-md text-center rounded-2xl border border-cream-300 bg-white p-8 shadow-warm">
          <h2 className="text-xl font-bold text-brown-900 font-display">Order Not Found</h2>
          <p className="text-xs text-brown-600 mt-2 mb-6">
            We couldn't locate an order record for ID: {id}.
          </p>
          <Button variant="primary" size="sm" onClick={() => router.push("/marketplace")}>
            Return to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const listing = order.listing;
  const device = listing?.device;
  const tracking = order.tracking || {
    carrier: "FedEx Priority Insured",
    trackingNumber: `RET-${order.id.slice(0, 8).toUpperCase()}-US`,
    estimatedDelivery: new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    origin: "ReTech Circular Hub, Austin TX",
    destination: "Verified Buyer Address",
    events: [
      { status: "PAID", label: "Payment Confirmed via Stripe Escrow", date: order.createdAt },
      {
        status: "PROCESSING",
        label: "42-Point Pre-Dispatch QA Inspection Passed",
        date: new Date(new Date(order.createdAt).getTime() + 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        status: "SHIPPED",
        label: "Dispatched with Carrier Insured Transit",
        date: new Date(new Date(order.createdAt).getTime() + 18 * 60 * 60 * 1000).toISOString(),
      },
    ],
  };

  const currentStatusIndex = ORDER_STAGES.findIndex((s) => s.id === order.status);

  return (
    <div className="min-h-screen bg-cream-50 pb-24">
      {/* Top Banner */}
      <div className="border-b border-cream-200 bg-white/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="pristine" dot>
                Order Confirmed
              </Badge>
              <span className="font-mono text-xs text-brown-500">ID: {order.id}</span>
            </div>
            <h1 className="text-3xl font-black text-brown-950 font-display">
              Order Tracking & Guarantee
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadInvoice}
              disabled={downloadingPdf}
              className="border-burgundy/30 text-burgundy hover:bg-burgundy/5 font-bold shadow-xs cursor-pointer"
              leftIcon={
                downloadingPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin text-burgundy" />
                ) : downloadSuccess ? (
                  <Check className="h-4 w-4 text-emerald-600" />
                ) : (
                  <FileDown className="h-4 w-4 text-burgundy" />
                )
              }
            >
              {downloadingPdf
                ? "Generating PDF..."
                : downloadSuccess
                ? "PDF Downloaded!"
                : "Download PDF Invoice"}
            </Button>
            <Link href="/marketplace">
              <Button variant="primary" size="sm">
                Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Visual Lifecycle Progress Bar */}
        <Card className="border-cream-300 bg-white p-6 sm:p-8 shadow-warm space-y-6">
          <div className="flex items-center justify-between border-b border-cream-200 pb-3">
            <h3 className="text-sm font-bold text-brown-950 font-display">
              Fulfillment Status Pipeline
            </h3>
            <span className="text-xs font-bold text-burgundy font-mono">
              Current Status: {order.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {ORDER_STAGES.map((st, idx) => {
              const isPassed = currentStatusIndex >= idx;
              const isCurrent = order.status === st.id;

              return (
                <div key={st.id} className="space-y-2">
                  <div
                    className={`h-2 w-full rounded-full transition-colors ${
                      isPassed ? "bg-emerald-600" : "bg-cream-200"
                    }`}
                  />
                  <div className="text-xs">
                    <span
                      className={`font-bold block ${
                        isPassed ? "text-emerald-800" : "text-brown-400"
                      }`}
                    >
                      {st.title}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                        Active Stage
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Carrier Tracking Box */}
        <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cream-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy text-white">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-brown-500 block text-[10px] uppercase font-bold">
                  Carrier & Tracking ID
                </span>
                <strong className="text-brown-950 text-sm font-mono font-bold">
                  {tracking.carrier} — {tracking.trackingNumber}
                </strong>
              </div>
            </div>

            <div className="text-right">
              <span className="text-brown-500 block text-[10px] uppercase font-bold">
                Estimated Delivery
              </span>
              <strong className="text-emerald-700 font-bold text-sm">
                {tracking.estimatedDelivery}
              </strong>
            </div>
          </div>

          {/* Tracking Step Events */}
          <div className="space-y-3 pt-1">
            <h4 className="font-bold text-brown-900 uppercase tracking-wider text-[11px]">
              Carrier Checkpoints
            </h4>
            <div className="space-y-2">
              {tracking.events.map((evt: any, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-cream-200 bg-cream-50/60 p-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <strong className="text-brown-900 block">{evt.label}</strong>
                      <span className="text-[10px] text-brown-500">Status: {evt.status}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-brown-500">
                    {new Date(evt.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Purchased Device & Warranty Guarantee */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-12">
          {/* Left 7 Cols: Device Card */}
          <Card className="sm:col-span-7 border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="text-sm font-bold text-brown-950 font-display">Purchased Device</h3>
              <Badge variant="pristine">{listing?.condition || "PRISTINE"}</Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-cream-200 bg-cream-50 shrink-0">
                <Image
                  src={getDeviceImageUrl(listing?.images)}
                  alt="Purchased Device"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-brown-950 text-sm font-display">
                  {listing?.title || "Refurbished Device"}
                </h4>
                <p className="text-brown-500 font-mono text-[11px]">
                  IMEI / Serial: {device?.imei || "359123456789012"}
                </p>
                <div className="pt-1">
                  <Link
                    href={`/passport/${device?.id || listing?.deviceId || id}`}
                    className="font-bold text-burgundy hover:underline inline-flex items-center gap-1 text-[11px]"
                  >
                    View Digital Life Passport <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>

          {/* Right 5 Cols: Guarantee Card */}
          <Card className="sm:col-span-5 border-cream-300 bg-gradient-to-br from-cream-100 to-cream-50 p-6 shadow-warm space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-brown-900 font-display border-b border-cream-200 pb-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>12-Month ReTech Guarantee</span>
            </div>

            <p className="text-brown-700 leading-relaxed">
              Your device is covered under official ReTech Certificate No:{" "}
              <strong className="font-mono text-brown-950">WARR-{order.id.slice(0, 6).toUpperCase()}</strong>.
            </p>

            <ul className="space-y-1 text-[11px] text-brown-600">
              <li>✓ 100% Battery capacity & sensor coverage</li>
              <li>✓ Free return transit & fast repair turnaround</li>
              <li>✓ 30-Day Money Back Guarantee</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
