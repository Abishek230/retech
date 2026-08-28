"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, Flag, MessageSquare, Reply } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface ReviewCardProps {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  buyerName?: string;
  sellerReply?: string;
  flagged?: boolean;
  canReply?: boolean;
  onReplySubmit?: (reply: string) => Promise<void>;
  onFlagToggle?: () => Promise<void>;
}

export function ReviewCard({
  id,
  rating,
  comment,
  createdAt,
  buyerName = "Verified Circular Buyer",
  sellerReply,
  flagged = false,
  canReply = false,
  onReplySubmit,
  onFlagToggle,
}: ReviewCardProps) {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleSendReply = async () => {
    if (!replyText.trim() || !onReplySubmit) return;
    setIsReplying(true);
    try {
      await onReplySubmit(replyText.trim());
      setShowReplyForm(false);
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <Card className="border-cream-300 bg-white p-5 shadow-sm space-y-3.5 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cream-100 font-bold text-burgundy text-xs">
            {buyerName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-brown-950 font-display">{buyerName}</span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">
                ✓ Verified Purchase
              </span>
            </div>
            <span className="text-[10px] text-brown-400 font-mono">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`h-4 w-4 ${
                s <= rating ? "fill-amber-400 text-amber-500" : "text-cream-300"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-brown-800 leading-relaxed">{comment}</p>

      {/* Seller Reply Box */}
      {sellerReply && (
        <div className="rounded-xl border border-cream-200 bg-cream-50/70 p-3.5 space-y-1">
          <div className="flex items-center gap-1.5 text-burgundy font-bold text-[11px]">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Seller Response:</span>
          </div>
          <p className="text-brown-700 text-[11px] leading-relaxed">{sellerReply}</p>
        </div>
      )}

      {/* Reply Action for Sellers */}
      {canReply && !sellerReply && (
        <div className="pt-1">
          {!showReplyForm ? (
            <button
              onClick={() => setShowReplyForm(true)}
              className="text-[11px] font-semibold text-burgundy hover:underline flex items-center gap-1"
            >
              <Reply className="h-3.5 w-3.5" /> Reply to Review
            </button>
          ) : (
            <div className="space-y-2 pt-1">
              <textarea
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write an official seller response..."
                className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-brown-900 focus:border-burgundy focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendReply}
                  disabled={isReplying}
                  className="rounded-lg bg-burgundy px-3 py-1 text-white font-bold text-[11px]"
                >
                  {isReplying ? "Publishing..." : "Publish Reply"}
                </button>
                <button
                  onClick={() => setShowReplyForm(false)}
                  className="text-[11px] text-brown-500 hover:text-brown-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
