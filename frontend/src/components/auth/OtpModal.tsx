"use client";

import React, { useState, useRef, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { ShieldCheck, RefreshCw } from "lucide-react";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  purpose?: string;
  onSuccess: () => void;
  onVerify: (otp: string) => Promise<{ success: boolean; error?: string }>;
  onResend: () => Promise<{ success: boolean; error?: string }>;
}

export function OtpModal({
  isOpen,
  onClose,
  email,
  purpose = "Verification",
  onSuccess,
  onVerify,
  onResend,
}: OtpModalProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    let timer: any;
    if (isOpen && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [isOpen, countdown]);

  // Focus first input on open
  useEffect(() => {
    if (isOpen) {
      setDigits(["", "", "", "", "", ""]);
      setError(null);
      setCountdown(60);
      setCanResend(false);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const split = pastedData.split("");
      setDigits(split);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = digits.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter all 6 digits of the OTP.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await onVerify(fullOtp);
      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.error || "Invalid OTP code. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setCanResend(false);
      setCountdown(60);
      setError(null);
      await onResend();
    } catch (err: any) {
      setError(err.message || "Failed to resend code");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter 6-Digit Verification Code"
      description={`We sent a secure single-use passcode to ${email} for ${purpose.toLowerCase()}.`}
      className="max-w-md"
    >
      <div className="space-y-6 pt-2">
        {/* OTP Input Boxes */}
        <div className="flex justify-between gap-2 sm:gap-3">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputRefs.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              onPaste={handlePaste}
              className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-cream-300 bg-cream-50/50 text-center font-mono text-xl sm:text-2xl font-black text-burgundy shadow-sm focus:border-burgundy focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/20 transition-all"
            />
          ))}
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-center text-xs font-semibold text-red-700">
            {error}
          </div>
        )}

        {/* Resend and Actions */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-brown-600">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-bold text-burgundy hover:underline inline-flex items-center gap-1"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Resend Code
              </button>
            ) : (
              <span>Resend available in {countdown}s</span>
            )}
          </span>
          <span className="text-brown-500 font-mono">Expires in 5 min</span>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" size="md" className="w-1/3" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            className="w-2/3"
            isLoading={isLoading}
            onClick={handleVerify}
            rightIcon={<ShieldCheck className="h-4 w-4" />}
          >
            Verify & Authenticate
          </Button>
        </div>
      </div>
    </Modal>
  );
}
