"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { QrCode, Copy, Check, Download, ShieldCheck } from "lucide-react";

interface QrCodeWidgetProps {
  qrDataUrl?: string;
  deviceId: string;
}

export function QrCodeWidget({ qrDataUrl, deviceId }: QrCodeWidgetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? window.location.href : `http://localhost:3000/passport/${deviceId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `retech-passport-qr-${deviceId.slice(0, 8)}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="border-cream-300 bg-white p-5 shadow-warm text-center space-y-4">
      <div className="flex items-center justify-center gap-2">
        <QrCode className="h-4 w-4 text-burgundy" />
        <h4 className="text-sm font-bold text-brown-900 font-display">
          Scan & Verify Passport
        </h4>
      </div>

      {/* QR Display */}
      <div className="relative mx-auto h-44 w-44 rounded-2xl border-2 border-cream-300 bg-white p-2 shadow-inner flex items-center justify-center">
        {qrDataUrl ? (
          <Image
            src={qrDataUrl}
            alt="Device Passport QR Code"
            width={160}
            height={160}
            className="rounded-xl"
          />
        ) : (
          <div className="h-36 w-36 bg-cream-100 rounded-xl animate-pulse flex items-center justify-center text-xs text-brown-400">
            Generating QR...
          </div>
        )}
      </div>

      <p className="text-[11px] text-brown-600 px-2 leading-relaxed">
        Scan this secure QR code on any mobile device to view real-time immutable hardware audit records.
      </p>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          leftIcon={copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
        >
          {copied ? "Copied!" : "Copy Link"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownloadQr}
          leftIcon={<Download className="h-3.5 w-3.5" />}
        >
          Save QR
        </Button>
      </div>
    </Card>
  );
}
