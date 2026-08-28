import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 1 USD = 83.50 INR (standard reference exchange rate)
export const USD_TO_INR_RATE = 83.5;

/**
 * Formats a monetary amount in Indian Rupees (₹ INR)
 */
export function formatINR(usdAmount: number): string {
  const inrAmount = usdAmount * USD_TO_INR_RATE;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(inrAmount);
}

/**
 * Formats a monetary amount in US Dollars ($ USD)
 */
export function formatUSD(usdAmount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: usdAmount % 1 === 0 ? 0 : 2,
  }).format(usdAmount);
}

/**
 * Default price formatter that displays BOTH Indian Rupees (₹) and US Dollars ($)
 * Example: formatPrice(849) => "₹70,892 ($849)"
 */
export function formatPrice(usdAmount: number, options?: { showUSDOnly?: boolean; showINROnly?: boolean }): string {
  if (options?.showINROnly) {
    return formatINR(usdAmount);
  }
  if (options?.showUSDOnly) {
    return formatUSD(usdAmount);
  }

  const inr = formatINR(usdAmount);
  const usd = formatUSD(usdAmount);
  return `${inr} (${usd})`;
}

export const DEFAULT_DEVICE_IMAGE =
  "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80";

/**
 * Safely parses images from database (handles JSON strings, raw URLs, and arrays)
 */
export function parseImages(images: any): string[] {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images.filter((img) => typeof img === "string" && (img.startsWith("http") || img.startsWith("/")));
  }
  if (typeof images === "string") {
    const trimmed = images.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter((img) => typeof img === "string" && (img.startsWith("http") || img.startsWith("/")));
        }
      } catch {
        // Fallback
      }
    }
    if (trimmed.startsWith("http") || trimmed.startsWith("/")) {
      return [trimmed];
    }
  }
  return [];
}

/**
 * Returns a guaranteed valid image URL for Next.js Image component
 */
export function getDeviceImageUrl(images: any, fallback = DEFAULT_DEVICE_IMAGE): string {
  const parsed = parseImages(images);
  return parsed.length > 0 ? parsed[0] : fallback;
}

