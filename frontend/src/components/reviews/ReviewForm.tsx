"use client";

import React, { useState } from "react";
import { Star, Send, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface ReviewFormProps {
  orderId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 20) {
      setErrorMessage("Review comment must contain at least 20 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const res = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit review.");
      }

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center text-xs space-y-2">
        <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
        <h4 className="font-bold text-brown-950 font-display text-sm">Review Submitted!</h4>
        <p className="text-brown-600">
          Thank you for contributing to our verified circular marketplace trust index.
        </p>
      </div>
    );
  }

  return (
    <Card className="border-cream-300 bg-white p-6 shadow-warm space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-cream-200 pb-3">
        <h4 className="font-bold text-brown-950 font-display text-sm">Leave a Verified Review</h4>
        <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
          Verified Buyer
        </span>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-[11px]">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-[11px] font-bold text-brown-700 uppercase mb-1.5">
            Your Rating (1 to 5 Stars)
          </label>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    (hoverRating || rating) >= star
                      ? "fill-amber-400 text-amber-500"
                      : "text-cream-300"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 font-mono font-bold text-brown-800 text-sm">
              {rating}.0 / 5.0
            </span>
          </div>
        </div>

        {/* Comment Textarea with 20+ char counter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-brown-700 uppercase">
              Your Feedback (Min. 20 characters)
            </label>
            <span
              className={`font-mono text-[10px] font-bold ${
                comment.length >= 20 ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {comment.length}/20 chars
            </span>
          </div>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with device cosmetic condition, battery retention, packaging, or delivery..."
            className="w-full rounded-xl border border-cream-300 p-3 text-xs text-brown-900 focus:border-burgundy focus:outline-none focus:ring-1 focus:ring-burgundy"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          className="w-full"
          isLoading={isSubmitting}
          rightIcon={<Send className="h-3.5 w-3.5" />}
        >
          Submit Verified Review
        </Button>
      </form>
    </Card>
  );
}
