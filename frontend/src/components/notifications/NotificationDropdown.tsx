"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  DollarSign,
  Eye,
  TrendingDown,
  Star,
  ShieldAlert,
  FileCheck,
  Sparkles,
  Bell,
  Trash2,
  Check,
} from "lucide-react";

interface NotificationItem {
  id: string;
  type: string;
  title?: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export function NotificationDropdown({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onClearAll,
}: NotificationDropdownProps) {
  if (!isOpen) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ORDER_PLACED":
        return <Package className="h-4 w-4 text-burgundy" />;
      case "ORDER_SHIPPED":
        return <Truck className="h-4 w-4 text-brown-700" />;
      case "ORDER_DELIVERED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "PAYMENT_RECEIVED":
        return <DollarSign className="h-4 w-4 text-emerald-600" />;
      case "PRICE_DROP":
        return <TrendingDown className="h-4 w-4 text-amber-600" />;
      case "REVIEW_RECEIVED":
        return <Star className="h-4 w-4 text-amber-500" />;
      case "WARRANTY_EXPIRING":
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case "PASSPORT_UPDATED":
        return <FileCheck className="h-4 w-4 text-emerald-700" />;
      case "AI_ANALYSIS_COMPLETE":
        return <Sparkles className="h-4 w-4 text-burgundy" />;
      default:
        return <Bell className="h-4 w-4 text-brown-600" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-cream-300 bg-white p-4 shadow-warm-lg z-50 text-xs space-y-3"
      >
        <div className="flex items-center justify-between border-b border-cream-200 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-brown-950 font-display text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-burgundy/10 px-2 py-0.5 text-[10px] font-bold text-burgundy">
                {unreadCount} new
              </span>
            )}
          </div>

          <button
            onClick={onClearAll}
            className="text-[11px] font-medium text-brown-500 hover:text-burgundy flex items-center gap-1"
          >
            <Check className="h-3 w-3" /> Mark all read
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-cream-100 -mx-1 px-1">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-brown-400 space-y-1">
              <Bell className="h-6 w-6 mx-auto opacity-40" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onMarkAsRead(n.id)}
                className={`py-2.5 px-2 rounded-xl transition-colors flex items-start gap-3 cursor-pointer ${
                  !n.read ? "bg-cream-50/80 font-medium" : "hover:bg-cream-50/40 text-brown-700"
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cream-100 shrink-0 mt-0.5">
                  {getTypeIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h6 className="font-bold text-brown-950 text-xs truncate">
                      {n.title || n.type.replace(/_/g, " ")}
                    </h6>
                    {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-burgundy shrink-0" />}
                  </div>
                  <p className="text-[11px] text-brown-600 line-clamp-2 mt-0.5 leading-snug">
                    {n.message}
                  </p>
                  <span className="text-[9px] text-brown-400 font-mono mt-1 block">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
