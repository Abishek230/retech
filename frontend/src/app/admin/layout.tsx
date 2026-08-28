"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  FileCheck,
  Scale,
  BarChart3,
  Activity,
  ScrollText,
  ShieldAlert,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

const ADMIN_NAV = [
  { name: "Overview", href: "/admin", icon: <LayoutDashboard className="h-4 w-4" /> },
  { name: "User Management", href: "/admin/users", icon: <Users className="h-4 w-4" /> },
  { name: "Listings Moderation", href: "/admin/listings", icon: <Package className="h-4 w-4" /> },
  { name: "Passport Verification", href: "/admin/passport", icon: <FileCheck className="h-4 w-4" />, badge: "14" },
  { name: "Dispute Resolution", href: "/admin/disputes", icon: <Scale className="h-4 w-4" />, badge: "3" },
  { name: "Platform Analytics", href: "/admin/analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { name: "System Health", href: "/admin/system", icon: <Activity className="h-4 w-4" />, dot: true },
  { name: "Audit Trail", href: "/admin/audit-log", icon: <ScrollText className="h-4 w-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-cream-300 bg-white p-5 space-y-6 shrink-0">
        {/* Brand / Access Badge */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-burgundy text-white shadow-sm">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <span className="text-base font-black text-brown-950 font-display">
              ReTech Admin
            </span>
          </div>
          <Badge variant="burgundy" className="text-[9px] py-0 px-1.5 font-mono">
            ADMIN LEVEL ACCESS
          </Badge>
        </div>

        {/* Nav Links */}
        <nav className="space-y-1 text-xs flex-1">
          {ADMIN_NAV.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-colors ${
                  isActive
                    ? "bg-burgundy text-white shadow-sm"
                    : "text-brown-700 hover:bg-cream-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-mono font-black ${
                      isActive
                        ? "bg-white text-burgundy"
                        : "bg-burgundy/10 text-burgundy"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.dot && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Back to App */}
        <div className="border-t border-cream-200 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-brown-500 hover:text-brown-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Return to Storefront
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-cream-300 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-burgundy" />
            <span className="font-bold text-brown-950 text-sm">ReTech Admin Console</span>
          </div>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 rounded-lg bg-cream-100 text-brown-800"
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileNavOpen && (
          <div className="md:hidden bg-white border-b border-cream-300 p-3 space-y-1 text-xs">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className="flex items-center justify-between p-2 rounded-lg text-brown-800 hover:bg-cream-100 font-bold"
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {children}
      </main>
    </div>
  );
}
