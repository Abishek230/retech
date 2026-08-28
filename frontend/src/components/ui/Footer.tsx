"use client";

import React from "react";
import Link from "next/link";
import { RotateCcw, ShieldCheck, Leaf, HeartHandshake, Sparkles } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";

export function Footer() {
  return (
    <footer className="border-t border-cream-300/80 bg-brown-900 text-cream-100">
      {/* Circular Economy Impact Ribbon */}
      <div className="border-b border-brown-800 bg-brown-950/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-burgundy/80 text-cream-100">
                <Leaf className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-cream-50">1,240+ Tons CO₂ Saved</p>
                <p className="text-xs text-cream-300/80">Equivalent to planting 58,000 trees</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-burgundy/80 text-cream-100">
                <ShieldCheck className="h-6 w-6 text-cream-200" />
              </div>
              <div>
                <p className="text-sm font-bold text-cream-50">12-Month Guarantee</p>
                <p className="text-xs text-cream-300/80">Every device certified & protected</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-burgundy/80 text-cream-100">
                <Sparkles className="h-6 w-6 text-amber-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-cream-50">AI Optical & Hardware Test</p>
                <p className="text-xs text-cream-300/80">42-point automated diagnostics</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-burgundy/80 text-cream-100">
                <HeartHandshake className="h-6 w-6 text-cream-200" />
              </div>
              <div>
                <p className="text-sm font-bold text-cream-50">Zero Electronic Waste</p>
                <p className="text-xs text-cream-300/80">Circular trade-in & ethical recycling</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-burgundy text-white">
                <RotateCcw className="h-5 w-5 text-cream" />
              </div>
              <span className="text-2xl font-black text-cream-50 font-display">
                Re<span className="text-cream-400">Tech</span>
              </span>
            </div>
            <p className="text-sm text-cream-300 leading-relaxed max-w-sm">
              ReTech is an AI-powered circular marketplace engineered to extend the lifecycle of premium electronics. We combine automated diagnostics, transparent grading, and guaranteed warranties to make refurbished tech the superior choice.
            </p>
            <div className="pt-2">
              <span className="inline-block rounded-lg bg-brown-800 px-3 py-1 text-xs text-cream-200">
                Design System: Cream (#F8F3EA) • Brown (#8A6652) • Burgundy (#641F2A)
              </span>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream-400">Marketplace</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream-200">
              <li><Link href="/marketplace" className="hover:text-white transition-colors">All Refurbished Gear</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Verified Customer Reviews</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition-colors">MacBooks & Ultrabooks</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition-colors">iPads & Tablets</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition-colors">Studio Headphones</Link></li>
            </ul>
          </div>

          {/* Column 2: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream-400">Platform</h4>
            <ul className="mt-4 space-y-2 text-sm text-cream-200">
              <li><Link href="#diagnostics" className="hover:text-white transition-colors">AI Diagnostic Engine</Link></li>
              <li><Link href="#trade-in" className="hover:text-white transition-colors">Instant Trade-In Calculator</Link></li>
              <li><Link href="#grading" className="hover:text-white transition-colors">Grading Standards</Link></li>
              <li><Link href="#business" className="hover:text-white transition-colors">Enterprise Circular Solutions</Link></li>
              <li><Link href="#warranty" className="hover:text-white transition-colors">Warranty & Returns</Link></li>
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cream-400">Stay Updated</h4>
            <p className="mt-4 text-xs text-cream-300 leading-relaxed">
              Get exclusive flash drops, trade-in bonus codes, and circular tech insights.
            </p>
            <div className="mt-3 space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-brown-700 bg-brown-950 px-3 py-2 text-xs text-cream-50 placeholder:text-brown-400 focus:border-burgundy focus:outline-none"
              />
              <Button variant="primary" size="sm" className="w-full text-xs">
                Subscribe to Drops
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-brown-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream-400">
          <p>© {new Date().getFullYear()} ReTech Inc. Circular Electronics. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#privacy" className="hover:text-cream-200">Privacy Policy</Link>
            <Link href="#terms" className="hover:text-cream-200">Terms of Service</Link>
            <Link href="#cookies" className="hover:text-cream-200">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
