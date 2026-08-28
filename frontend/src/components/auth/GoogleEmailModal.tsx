"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Mail, ArrowRight, Loader2 } from "lucide-react";

interface GoogleEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
  onConfirm: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export function GoogleEmailModal({
  isOpen,
  onClose,
  initialEmail = "",
  onConfirm,
}: GoogleEmailModalProps) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail(initialEmail);
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!trimmed) {
      setError("Please enter your Google email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const res = await onConfirm(trimmed);
      if (!res.success) {
        setError(res.error || "Google authentication failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google authentication.");
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) onClose();
      }}
      title="Continue with Google"
      description="Enter your Google account email address to authenticate."
      className="max-w-md"
    >
      <div className="space-y-6 pt-2">
        {/* Google Branding Header */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-cream-50 border border-cream-200">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border border-cream-200">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div className="text-left text-xs">
            <p className="font-bold text-brown-950">Verify Google Account</p>
            <p className="text-brown-600">You will be redirected to Google to verify access.</p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 animate-in fade-in">
            {error}
          </div>
        )}

        {/* Email Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-brown-700 mb-1.5">
              Google Email Address
            </label>
            <Input
              type="email"
              placeholder="you@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoFocus
              leftIcon={<Mail className="h-4 w-4 text-brown-400" />}
              className="bg-white text-sm"
              required
            />
            <p className="mt-1 text-[11px] text-brown-500">
              Enter the Google account email you wish to authenticate with.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="h-4 w-4" /> : undefined}
              className="flex-1 shadow-warm"
            >
              {isLoading ? "Connecting..." : "Proceed to Google"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
