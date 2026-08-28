"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createListing, uploadListingImages } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import {
  UploadCloud,
  CheckCircle2,
  Cpu,
  Leaf,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Smartphone,
  Check,
  Loader2,
} from "lucide-react";

const POPULAR_BRANDS = ["Apple", "Samsung", "Dell", "Lenovo", "Sony", "Google", "HP", "ASUS"];
const STORAGE_OPTIONS = ["128GB", "256GB", "512GB", "1TB", "2TB"];
const RAM_OPTIONS = ["8GB", "16GB", "32GB", "64GB"];
const CONDITION_GUIDES = [
  {
    id: "PRISTINE",
    title: "Grade A+ (Pristine)",
    desc: "Flawless screen & body. Battery health 95%+. Zero micro-scratches.",
    score: "98.2",
  },
  {
    id: "EXCELLENT",
    title: "Grade A (Excellent)",
    desc: "Near mint condition. Minimal faint cosmetic wear not visible at arm's length.",
    score: "95.6",
  },
  {
    id: "GOOD",
    title: "Grade B (Good)",
    desc: "Light surface scratches on casing. Screen is 100% intact and functional.",
    score: "91.4",
  },
  {
    id: "FAIR",
    title: "Grade C (Fair)",
    desc: "Visible signs of usage, minor dents on chassis. 100% diagnostic operational pass.",
    score: "86.0",
  },
];

export default function SellCreatePage() {
  const router = useRouter();
  const { user, accessToken } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  // Step 1: Device Details
  const [brand, setBrand] = useState("Apple");
  const [model, setModel] = useState("");
  const [storage, setStorage] = useState("256GB");
  const [ram, setRam] = useState("8GB");
  const [color, setColor] = useState("Space Gray");
  const [year, setYear] = useState(new Date().getFullYear());

  // Step 2: Condition & Price
  const [condition, setCondition] = useState<"PRISTINE" | "EXCELLENT" | "GOOD" | "FAIR">("EXCELLENT");
  const [price, setPrice] = useState<string>("899");
  const [description, setDescription] = useState("");

  // Step 3: Images
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([
    "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
  ]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploadingImages(true);
      setErrorMessage(null);
      const res = await uploadListingImages(Array.from(files));
      setUploadedImageUrls((prev) => [...prev, ...res.urls]);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to upload images");
    } finally {
      setIsUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!brand || !model.trim()) {
        setErrorMessage("Please specify both the brand and exact device model.");
        return;
      }
    } else if (currentStep === 2) {
      const numPrice = parseFloat(price);
      if (!numPrice || numPrice <= 0) {
        setErrorMessage("Please enter a valid listing price.");
        return;
      }
    } else if (currentStep === 3) {
      if (uploadedImageUrls.length === 0) {
        setErrorMessage("Please upload at least 1 image of the device.");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePublish = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const payload = {
        brand,
        model,
        storage,
        ram,
        color,
        year: parseInt(String(year), 10),
        condition,
        price: parseFloat(price),
        description,
        images: uploadedImageUrls,
      };

      const res = await createListing(payload, accessToken || undefined);
      if (res.data?.id) {
        router.push(`/listings/${res.data.id}`);
      } else {
        router.push("/marketplace");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to publish device listing");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <Badge variant="burgundy" dot>
            Seller Portal • Circular Verification
          </Badge>
          <h1 className="text-3xl font-black text-brown-950 font-display sm:text-4xl">
            List a Refurbished Device
          </h1>
          <p className="text-xs text-brown-600">
            Publish your device with automated AI Second-Life scoring and Digital Life Passport minting.
          </p>
        </div>

        {/* 4-Step Progress Indicator */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { step: 1, title: "1. Device Specs" },
            { step: 2, title: "2. Condition & Price" },
            { step: 3, title: "3. Image Upload" },
            { step: 4, title: "4. Review & Publish" },
          ].map((item) => (
            <div key={item.step} className="space-y-1.5">
              <div
                className={`h-2 w-full rounded-full transition-colors ${
                  currentStep >= item.step ? "bg-burgundy" : "bg-cream-200"
                }`}
              />
              <span
                className={`font-semibold hidden sm:inline-block ${
                  currentStep >= item.step ? "text-burgundy" : "text-brown-400"
                }`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* Main Step Form Card */}
        <Card className="border-cream-300 bg-white p-6 sm:p-8 shadow-warm">
          {errorMessage && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Device Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-cream-200 pb-3">
                <h3 className="text-lg font-bold text-brown-900 font-display">
                  Step 1: Device Specifications
                </h3>
                <p className="text-xs text-brown-500">
                  Select the manufacturer brand and specify device hardware configuration.
                </p>
              </div>

              {/* Brand Pills */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brown-700 mb-2">
                  Select Manufacturer Brand
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_BRANDS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBrand(b)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        brand === b
                          ? "bg-burgundy text-white border-burgundy shadow-sm"
                          : "bg-cream-50 border-cream-300 text-brown-800 hover:bg-cream-100"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Device Model Name"
                  placeholder="e.g. MacBook Pro 14-inch M3 Pro / Galaxy S24 Ultra"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
                <Input
                  label="Color / Finish"
                  placeholder="e.g. Space Black / Titanium Gray"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brown-700 mb-1.5">
                    Storage Capacity
                  </label>
                  <select
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 p-2.5 text-xs font-semibold text-brown-900 focus:outline-none focus:ring-2 focus:ring-burgundy"
                  >
                    {STORAGE_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brown-700 mb-1.5">
                    RAM / Memory
                  </label>
                  <select
                    value={ram}
                    onChange={(e) => setRam(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 p-2.5 text-xs font-semibold text-brown-900 focus:outline-none focus:ring-2 focus:ring-burgundy"
                  >
                    {RAM_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brown-700 mb-1.5">
                    Manufacturing Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 p-2.5 text-xs font-semibold text-brown-900 focus:outline-none focus:ring-2 focus:ring-burgundy"
                  >
                    {[2024, 2023, 2022, 2021, 2020, 2019].map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Condition & Price */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-cream-200 pb-3">
                <h3 className="text-lg font-bold text-brown-900 font-display">
                  Step 2: Condition Grade & Pricing
                </h3>
                <p className="text-xs text-brown-500">
                  Select the physical grading and set your fair circular market price.
                </p>
              </div>

              {/* Condition Options */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-brown-700">
                  Condition Rating
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CONDITION_GUIDES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCondition(item.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        condition === item.id
                          ? "border-burgundy bg-burgundy/5 ring-2 ring-burgundy/20"
                          : "border-cream-300 bg-cream-50 hover:bg-cream-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brown-900">{item.title}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          Score ~{item.score}
                        </span>
                      </div>
                      <p className="text-[11px] text-brown-600 mt-1">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Listing Price ($ USD)"
                  type="number"
                  placeholder="899"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  helperText="Suggested circular retail price for this grade."
                  required
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-brown-700 mb-1.5">
                    Seller Notes / Diagnostics
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Battery replaced with OEM Apple certified battery. Original packaging included."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-cream-300 bg-cream-50 p-2.5 text-xs text-brown-900 focus:outline-none focus:ring-2 focus:ring-burgundy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Image Upload */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-cream-200 pb-3">
                <h3 className="text-lg font-bold text-brown-900 font-display">
                  Step 3: High-Resolution Images (Sharp Auto-Optimized)
                </h3>
                <p className="text-xs text-brown-500">
                  Upload photos of front, back, and display. Images are automatically resized to max 800px and converted to WebP.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-cream-400 bg-cream-50 p-8 hover:bg-cream-100 cursor-pointer transition-colors">
                <UploadCloud className="h-10 w-10 text-burgundy mb-2" />
                <p className="text-xs font-bold text-brown-900">
                  Click or drag images to upload
                </p>
                <p className="text-[11px] text-brown-500 mt-1">
                  Supports JPEG, PNG, WebP (Max 800px optimized by Sharp)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploadingImages}
                />
              </label>

              {isUploadingImages && (
                <div className="flex items-center justify-center gap-2 text-xs font-semibold text-burgundy">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing & optimizing images with Sharp...</span>
                </div>
              )}

              {/* Thumbnails */}
              {uploadedImageUrls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-brown-700">
                    Uploaded Gallery ({uploadedImageUrls.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {uploadedImageUrls.map((url, idx) => (
                      <div key={idx} className="relative h-28 rounded-xl overflow-hidden border border-cream-300 group">
                        <Image src={url} alt={`Upload ${idx + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 rounded-full bg-brown-950/80 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Review and Publish */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-cream-200 pb-3">
                <h3 className="text-lg font-bold text-brown-900 font-display">
                  Step 4: Review & Mint Digital Passport
                </h3>
                <p className="text-xs text-brown-500">
                  Verify your device details before publishing to the ReTech marketplace.
                </p>
              </div>

              {/* Summary Card */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 rounded-2xl border border-cream-300 bg-cream-50/70 p-5">
                <div className="sm:col-span-4 relative h-40 sm:h-full rounded-xl overflow-hidden border border-cream-200 bg-white">
                  <Image
                    src={uploadedImageUrls[0] || "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"}
                    alt={model}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div className="sm:col-span-8 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-brown-500">{brand} • {year}</span>
                    <h4 className="text-lg font-black text-brown-950 font-display">
                      {brand} {model}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-brown-500 block">Configuration:</span>
                      <strong className="text-brown-900">{storage} • {ram} RAM • {color}</strong>
                    </div>
                    <div>
                      <span className="text-brown-500 block">Condition Grade:</span>
                      <Badge variant="pristine">{condition}</Badge>
                    </div>
                  </div>

                  <div className="border-t border-cream-200 pt-2 flex items-baseline justify-between">
                    <span className="text-brown-600 font-semibold">Publish Price:</span>
                    <span className="text-2xl font-black text-burgundy font-display">
                      {formatPrice(parseFloat(price) || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Estimated AI Scores Preview */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-cream-300 bg-white p-3 shadow-sm flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-burgundy/10 text-burgundy">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-brown-500 block text-[10px]">Estimated AI Score</span>
                    <strong className="text-brown-900 text-sm font-display">
                      {condition === "PRISTINE" ? "98.2" : condition === "EXCELLENT" ? "95.6" : "91.4"} / 100
                    </strong>
                  </div>
                </div>

                <div className="rounded-xl border border-cream-300 bg-white p-3 shadow-sm flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Leaf className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-brown-500 block text-[10px]">Estimated Carbon Offset</span>
                    <strong className="text-emerald-800 text-sm font-display">-58.4kg CO₂</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card Navigation Footer */}
          <div className="flex items-center justify-between border-t border-cream-200 pt-6 mt-8">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handlePrev}
                leftIcon={<ArrowLeft className="h-4 w-4" />}
              >
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handlePublish}
                isLoading={isSubmitting}
                rightIcon={<CheckCircle2 className="h-5 w-5" />}
              >
                Publish Listing
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
