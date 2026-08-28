"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
  ShoppingBag,
  Menu,
  X,
  RotateCcw,
  User as UserIcon,
  LogOut,
  Store,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Button } from "./Button";
import { Badge } from "./Badge";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigation = [
    { name: "Marketplace", href: "/marketplace" },
    { name: "Reviews", href: "/reviews", badge: "4.9★" },
    { name: "Eco Impact", href: "/impact", badge: "Live" },
    { name: "Seller Hub", href: "/seller/dashboard", badge: "Pro" },
    { name: "Trade-In & Sell", href: "/sell/create" },
    { name: "Why ReTech", href: "/#impact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cream-200/80 bg-cream-50/90 backdrop-blur-md">
      {/* Top Banner */}
      <div className="bg-burgundy text-white px-4 py-1.5 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="h-3.5 w-3.5 text-cream-200 animate-pulse" />
        <span>Every device includes certified 12-month warranty & verified AI battery health score</span>
      </div>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-burgundy text-white shadow-sm transition-transform group-hover:scale-105">
              <RotateCcw className="h-5 w-5 text-cream" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-burgundy font-display">
                  Re<span className="text-brown-700">Tech</span>
                </span>
                <Badge variant="pristine" className="hidden sm:inline-flex text-[10px] py-0 px-1.5">
                  Circular AI
                </Badge>
              </div>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-brown-500 -mt-1">
                Refurbished Electronics
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search MacBooks, iPhones, ThinkPads, OLED monitors..."
              className="w-full rounded-full border border-cream-300 bg-white/80 py-2 pl-10 pr-4 text-xs text-brown-900 placeholder:text-brown-400/80 focus:border-burgundy focus:bg-white focus:outline-none focus:ring-2 focus:ring-burgundy/15 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-1.5 text-sm font-medium text-brown-800 hover:text-burgundy transition-colors"
            >
              {item.name}
              {item.badge && (
                <span className="rounded bg-burgundy/10 px-1.5 py-0.5 text-[10px] font-bold text-burgundy">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Action Buttons & User Menu */}
        <div className="flex items-center gap-2.5">
          <NotificationBell />

          <Link
            href="/cart"
            className="relative p-2 rounded-xl text-brown-700 hover:bg-cream-200/70 transition-colors"
            title="View Shopping Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex min-w-[18px] h-[18px] px-1 items-center justify-center rounded-full bg-burgundy text-[10px] font-bold text-white shadow-sm animate-in fade-in zoom-in duration-200">
                {itemCount}
              </span>
            )}
          </Link>

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-xl border border-cream-300 bg-white px-3 py-1.5 text-xs font-semibold text-brown-900 shadow-sm hover:border-burgundy transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-burgundy/10 text-burgundy">
                  <UserIcon className="h-3.5 w-3.5" />
                </div>
                <span className="max-w-[100px] truncate">{user.name.split(" ")[0]}</span>
                <Badge
                  variant={user.role === "ADMIN" ? "burgundy" : user.role === "SELLER" ? "brown" : "cream"}
                  className="text-[9px] py-0 px-1"
                >
                  {user.role}
                </Badge>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-cream-300 bg-white p-2 shadow-warm-lg z-50 text-xs">
                  <div className="px-3 py-2 border-b border-cream-200">
                    <p className="font-bold text-brown-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-brown-500 truncate">{user.email}</p>
                  </div>
                  {user.role === "SELLER" ? (
                    <Link
                      href="/seller/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream-100 text-brown-800"
                    >
                      <Store className="h-3.5 w-3.5 text-brown-600" />
                      Seller Command Center
                    </Link>
                  ) : (
                    <Link
                      href="/seller/onboarding"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream-100 text-burgundy font-semibold"
                    >
                      <Store className="h-3.5 w-3.5 text-burgundy" />
                      Become a Seller (Pro)
                    </Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link
                      href="#admin-panel"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-cream-100 text-brown-800"
                    >
                      <ShieldAlert className="h-3.5 w-3.5 text-burgundy" />
                      Admin Console
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-red-50 text-red-700 font-semibold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="hidden sm:inline-flex">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-2 text-brown-700 hover:bg-cream-200 lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-cream-200 bg-cream-50 px-4 pt-3 pb-6 lg:hidden space-y-3">
          <div className="relative w-full mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-400" />
            <input
              type="text"
              placeholder="Search refurbished gear..."
              className="w-full rounded-xl border border-cream-300 bg-white py-2 pl-10 pr-4 text-sm text-brown-900 focus:outline-none focus:ring-2 focus:ring-burgundy"
            />
          </div>
          <div className="flex flex-col space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-brown-800 hover:bg-cream-200"
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="rounded bg-burgundy/10 px-1.5 py-0.5 text-[10px] font-bold text-burgundy">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-cream-200 flex gap-2">
            {isAuthenticated ? (
              <Button variant="outline" size="md" className="w-full" onClick={() => logout()}>
                Sign Out
              </Button>
            ) : (
              <>
                <Link href="/login" className="w-1/2">
                  <Button variant="outline" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" className="w-1/2">
                  <Button variant="primary" size="md" className="w-full">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
