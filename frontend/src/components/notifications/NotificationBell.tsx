"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import { useAuth } from "@/context/AuthContext";
import { NotificationDropdown } from "./NotificationDropdown";

export function NotificationBell() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || "demo_buyer_user_1";

  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications/${userId}`);
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.data?.notifications || []);
        setUnreadCount(json.data?.unreadCount || 0);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Socket.io Real-Time Listener
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 2,
    });

    socket.on(`notification:new:${userId}`, (newNotif: any) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, SOCKET_URL]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`${API_BASE}/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // Ignore
    }
  };

  const handleClearAll = async () => {
    try {
      await fetch(`${API_BASE}/notifications/clear`, { method: "DELETE" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {
      // Ignore
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-brown-700 hover:bg-cream-200/70 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkAsRead={handleMarkAsRead}
        onClearAll={handleClearAll}
      />
    </div>
  );
}
