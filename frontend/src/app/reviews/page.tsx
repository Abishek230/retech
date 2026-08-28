"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  Filter,
  Plus,
  ArrowRight,
  BatteryCharging,
  Cpu,
  Package,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils";

interface ReviewItem {
  id: string;
  userName: string;
  userAvatar: string;
  verifiedBuyer: boolean;
  productName: string;
  productPrice: number;
  productImage: string;
  category: string;
  rating: number;
  date: string;
  comment: string;
  batteryHealthReported: number;
  sellerReply?: {
    sellerName: string;
    comment: string;
    date: string;
  };
  helpfulCount: number;
}

const REVIEWS_DATA: ReviewItem[] = [
  {
    id: "rev_1",
    userName: "Rahul Sharma",
    userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    verifiedBuyer: true,
    productName: "Apple iPhone 15 Pro 128GB - Natural Titanium",
    productPrice: 849.0,
    productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80",
    category: "Smartphones",
    rating: 5,
    date: "August 22, 2026",
    comment: "Device arrived in pristine cosmetic condition! Scanned the QR passport and verified the 99% battery health. Saved over ₹35,000 compared to brand new retail. Circular economy for the win!",
    batteryHealthReported: 99,
    sellerReply: {
      sellerName: "Austin Circular Labs",
      comment: "Thank you Rahul! We rigorously calibrate every titanium chassis through optical sensors. Enjoy your circular iPhone!",
      date: "August 22, 2026",
    },
    helpfulCount: 42,
  },
  {
    id: "rev_2",
    userName: "Priya Patel",
    userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    verifiedBuyer: true,
    productName: 'Apple MacBook Air 13.6" M2 (8GB / 256GB SSD) - Midnight',
    productPrice: 699.0,
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80",
    category: "Laptops",
    rating: 5,
    date: "August 20, 2026",
    comment: "Only 42 charge cycles on the battery! Zero thermal throttling during heavy Figma and VS Code sessions. Unboxing felt identical to an official retail unit with the certified 12-month warranty included.",
    batteryHealthReported: 96,
    sellerReply: {
      sellerName: "Nordic Tech Refurb",
      comment: "Delighted you love the M2 Air! Every battery is OEM verified and stress tested before shipping.",
      date: "August 21, 2026",
    },
    helpfulCount: 29,
  },
  {
    id: "rev_3",
    userName: "Vikram Mehta",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    verifiedBuyer: true,
    productName: "Sony WH-1000XM5 Wireless ANC Headphones - Black",
    productPrice: 249.0,
    productImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
    category: "Audio",
    rating: 5,
    date: "August 18, 2026",
    comment: "The noise cancellation is insane. Earpads are completely fresh and sanitized. Unbelievable price point for a flagship headphone. 10/10 recommend ReTech!",
    batteryHealthReported: 100,
    helpfulCount: 18,
  },
  {
    id: "rev_4",
    userName: "Ananya Iyer",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    verifiedBuyer: true,
    productName: "Apple iPad 10th Gen 64GB Wi-Fi - Silver",
    productPrice: 299.0,
    productImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=300&q=80",
    category: "Tablets",
    rating: 5,
    date: "August 16, 2026",
    comment: "Bought this for college digital notes and Procreate drawing. Battery lasts all day long and the display is crystal clear. Love the environmental impact counter showing 32kg CO2 saved!",
    batteryHealthReported: 97,
    helpfulCount: 15,
  },
  {
    id: "rev_5",
    userName: "Karthik Nair",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    verifiedBuyer: true,
    productName: "Lenovo ThinkPad X1 Carbon Gen 9 (i7 / 16GB / 512GB)",
    productPrice: 489.0,
    productImage: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=300&q=80",
    category: "Laptops",
    rating: 5,
    date: "August 14, 2026",
    comment: "Legendary ThinkPad keyboard feel! Saved over 65% off original MSRP. Running Linux Mint effortlessly. Thank you ReTech for making high-performance laptops affordable.",
    batteryHealthReported: 92,
    helpfulCount: 31,
  },
  {
    id: "rev_6",
    userName: "Sneha Reddy",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    verifiedBuyer: true,
    productName: "Apple AirPods Pro 2nd Gen (USB-C MagSafe)",
    productPrice: 149.0,
    productImage: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=300&q=80",
    category: "Audio",
    rating: 5,
    date: "August 12, 2026",
    comment: "Sanitized tips, pristine charging case, and perfect spatial audio tracking. Arrived in 2 business days via insured express shipping.",
    batteryHealthReported: 98,
    helpfulCount: 22,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS_DATA);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedRating, setSelectedRating] = useState<number | "ALL">("ALL");
  const [modalOpen, setModalOpen] = useState(false);

  // New review state
  const [newRating, setNewRating] = useState(5);
  const [newDevice, setNewDevice] = useState("Apple iPhone 15 Pro");
  const [newComment, setNewComment] = useState("");
  const [newBattery, setNewBattery] = useState("98");
  const [submitted, setSubmitted] = useState(false);

  const categories = ["ALL", "Smartphones", "Laptops", "Tablets", "Audio"];

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const item: ReviewItem = {
      id: `rev_${Date.now()}`,
      userName: "Verified Tech Enthusiast",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      verifiedBuyer: true,
      productName: newDevice,
      productPrice: 499.0,
      productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=300&q=80",
      category: "Smartphones",
      rating: newRating,
      date: "Just now",
      comment: newComment,
      batteryHealthReported: parseInt(newBattery, 10) || 95,
      helpfulCount: 1,
    };

    setReviews([item, ...reviews]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setModalOpen(false);
      setNewComment("");
    }, 1500);
  };

  const filtered = reviews.filter((r) => {
    const matchesCat = selectedCategory === "ALL" || r.category === selectedCategory;
    const matchesRating = selectedRating === "ALL" || r.rating === selectedRating;
    return matchesCat && matchesRating;
  });

  return (
    <div className="min-h-screen bg-cream-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Header Banner */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-warm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="pristine">100% Verified Circular Orders</Badge>
              <Badge variant="burgundy">Certified Warranty Backed</Badge>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-brown-950 font-display tracking-tight">
              Community Reviews & Ratings
            </h1>
            <p className="text-sm text-brown-600 max-w-2xl">
              Authentic reviews from verified buyers across India & worldwide. Every device is backed by our 12-month guarantee and cryptographic Digital Life Passport.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 bg-cream-50 p-4 rounded-2xl border border-cream-200 shrink-0">
            <div className="text-center">
              <div className="text-4xl font-black text-burgundy font-display">4.95</div>
              <div className="flex items-center gap-0.5 justify-center my-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <span className="text-[11px] text-brown-500 font-semibold font-mono">1,248 Verified Ratings</span>
            </div>

            <div className="h-12 w-px bg-cream-300 hidden sm:block" />

            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setModalOpen(true)}
            >
              Write a Review
            </Button>
          </div>
        </div>

        {/* 2. Filters Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-cream-200 shadow-sm">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-burgundy text-white shadow-sm"
                    : "bg-cream-100 text-brown-700 hover:bg-cream-200"
                }`}
              >
                {cat === "ALL" ? "All Categories" : cat}
              </button>
            ))}
          </div>

          {/* Star Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brown-500 uppercase">Rating:</span>
            {[
              { label: "All", val: "ALL" },
              { label: "5 ★", val: 5 },
              { label: "4 ★", val: 4 },
            ].map((st) => (
              <button
                key={String(st.val)}
                onClick={() => setSelectedRating(st.val as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedRating === st.val
                    ? "bg-amber-500 text-white"
                    : "bg-cream-100 text-brown-700 hover:bg-cream-200"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Reviews List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((rev) => (
            <Card key={rev.id} className="border-cream-200 bg-white p-6 shadow-warm space-y-4 hover:shadow-warm-lg transition-all flex flex-col justify-between">
              <div className="space-y-3">
                {/* User & Rating */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="h-10 w-10 rounded-full border border-cream-300 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-sm text-brown-950 font-display">{rev.userName}</strong>
                        {rev.verifiedBuyer && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 fill-emerald-100" />
                        )}
                      </div>
                      <span className="text-[10px] text-brown-400 font-mono block">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold text-amber-900 font-mono">{rev.rating}.0</span>
                  </div>
                </div>

                {/* Product Pill */}
                <div className="flex items-center gap-3 bg-cream-50 p-2.5 rounded-xl border border-cream-200">
                  <img
                    src={rev.productImage}
                    alt={rev.productName}
                    className="h-10 w-10 rounded-lg object-contain bg-white p-1 border border-cream-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-brown-900 truncate block font-display">
                      {rev.productName}
                    </span>
                    <span className="text-[11px] font-black text-burgundy font-mono block">
                      {formatPrice(rev.productPrice)}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-brown-800 leading-relaxed font-sans">
                  "{rev.comment}"
                </p>

                {/* Battery Callout */}
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[10px] font-bold text-emerald-800">
                  <BatteryCharging className="h-3 w-3 text-emerald-600" />
                  <span>Verified Battery Health: {rev.batteryHealthReported}% Retention</span>
                </div>

                {/* Seller Reply */}
                {rev.sellerReply && (
                  <div className="bg-cream-50/80 p-3 rounded-xl border-l-2 border-burgundy text-[11px] text-brown-800 space-y-1">
                    <div className="flex items-center justify-between text-burgundy font-bold">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Response from {rev.sellerReply.sellerName}
                      </span>
                      <span className="text-[9px] text-brown-400 font-mono">{rev.sellerReply.date}</span>
                    </div>
                    <p className="italic">{rev.sellerReply.comment}</p>
                  </div>
                )}
              </div>

              {/* Helpful footer */}
              <div className="border-t border-cream-100 pt-3 flex items-center justify-between text-[11px] text-brown-500">
                <span>Verified Purchase via Stripe Escrow</span>
                <button
                  onClick={() => {
                    setReviews(reviews.map((r) => r.id === rev.id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r));
                  }}
                  className="flex items-center gap-1 hover:text-burgundy transition-colors font-semibold"
                >
                  <ThumbsUp className="h-3 w-3" /> Helpful ({rev.helpfulCount})
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* 4. Bottom CTA banner */}
        <div className="bg-gradient-to-r from-burgundy to-burgundy-950 rounded-3xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-warm">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="text-xl font-bold font-display">Ready to join 1,200+ happy circular tech owners?</h3>
            <p className="text-xs text-cream-200">
              Browse certified electronics with dual ₹ INR / $ USD pricing and 12-month warranties.
            </p>
          </div>

          <Link href="/marketplace">
            <Button variant="secondary" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Explore Marketplace
            </Button>
          </Link>
        </div>
      </div>

      {/* Write Review Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Submit a Verified Product Review">
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-brown-950">Review Submitted Successfully!</h4>
            <p className="text-xs text-brown-600">
              Thank you for contributing to the ReTech circular electronics community.
            </p>
          </div>
        ) : (
          <form onSubmit={handleAddReview} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-brown-700 uppercase mb-1">
                Select Star Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-1 text-amber-500 focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 transition-all ${
                        star <= newRating ? "fill-amber-500 text-amber-500" : "text-cream-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brown-700 uppercase mb-1">
                Device / Model Purchased
              </label>
              <select
                value={newDevice}
                onChange={(e) => setNewDevice(e.target.value)}
                className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-brown-900 bg-cream-50 focus:border-burgundy focus:outline-none font-semibold"
              >
                <option value="Apple iPhone 15 Pro 128GB">Apple iPhone 15 Pro 128GB</option>
                <option value='Apple MacBook Air 13.6" M2'>Apple MacBook Air 13.6" M2</option>
                <option value="Samsung Galaxy S23 Ultra 256GB">Samsung Galaxy S23 Ultra 256GB</option>
                <option value="Google Pixel 8 Pro 128GB">Google Pixel 8 Pro 128GB</option>
                <option value="Sony WH-1000XM5 Wireless Headphones">Sony WH-1000XM5 Wireless Headphones</option>
                <option value="Apple iPad 10th Gen 64GB">Apple iPad 10th Gen 64GB</option>
                <option value="Nintendo Switch OLED Model">Nintendo Switch OLED Model</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brown-700 uppercase mb-1">
                Verified Battery Health (%)
              </label>
              <input
                type="number"
                min={80}
                max={100}
                value={newBattery}
                onChange={(e) => setNewBattery(e.target.value)}
                className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-brown-900 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-brown-700 uppercase mb-1">
                Your Review & Feedback
              </label>
              <textarea
                rows={4}
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Describe cosmetic condition, unboxing experience, battery performance..."
                className="w-full rounded-xl border border-cream-300 p-2.5 text-xs text-brown-900 focus:border-burgundy focus:outline-none"
              />
            </div>

            <Button variant="primary" size="md" className="w-full" type="submit">
              Post Verified Review
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
