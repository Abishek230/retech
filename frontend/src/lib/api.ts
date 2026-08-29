export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "https://retech-tsac.onrender.com/api"
    : "http://localhost:5000/api");

export interface DeviceListingItem {
  id: string;
  deviceId: string;
  sellerId: string;
  title: string;
  price: number;
  condition: "PRISTINE" | "EXCELLENT" | "GOOD" | "FAIR";
  status: "ACTIVE" | "DRAFT" | "RESERVED" | "SOLD" | "ARCHIVED";
  images: string[];
  createdAt: string;
  updatedAt: string;
  device: {
    id: string;
    brand: string;
    model: string;
    category?: string;
    storage: string;
    ram: string;
    color: string;
    year: number;
    imei: string;
    secondLifeScores?: Array<{
      id: string;
      score: number;
      breakdown: {
        batteryHealth?: number;
        cosmeticIndex?: number;
        screenIntegrity?: number;
        thermalEfficiency?: number;
      };
      calculatedAt: string;
    }>;
    sustainabilityRecords?: Array<{
      id: string;
      co2SavedKg: number;
      eWasteAvoidedKg: number;
    }>;
    digitalPassport?: {
      id: string;
      previousOwners: number;
      originalPurchaseDate?: string;
      verifiedAt?: string;
      history?: any[];
      repairs?: any[];
      entries?: Array<{
        id: string;
        type: "REPAIR" | "OWNERSHIP" | "INSPECTION" | "CERTIFICATION" | "FACTORY_RESET";
        description: string;
        date: string;
        verifiedBy: string;
      }>;
    };
    aiDecisions?: Array<{
      id: string;
      recommendation: "BUY" | "SELL" | "HOLD";
      reasoning: string;
      confidence: number;
      createdAt: string;
    }>;
  };
  seller: {
    id: string;
    name: string;
    email?: string;
    avatar?: string | null;
    createdAt?: string;
    sellerProfile?: {
      businessName: string;
      verified: boolean;
      rating: number;
      totalSales: number;
    } | null;
  };
}

export async function fetchListings(page = 1, limit = 12): Promise<{ data: DeviceListingItem[]; pagination: any }> {
  const res = await fetch(`${API_BASE}/listings?page=${page}&limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function searchListings(query: string): Promise<{ data: DeviceListingItem[]; count: number }> {
  const res = await fetch(`${API_BASE}/listings/search?q=${encodeURIComponent(query)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function filterListings(params: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  minScore?: number;
  sort?: string;
}): Promise<{ data: DeviceListingItem[]; count: number }> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.brand) query.set("brand", params.brand);
  if (params.minPrice !== undefined) query.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) query.set("maxPrice", String(params.maxPrice));
  if (params.condition) query.set("condition", params.condition);
  if (params.minScore !== undefined) query.set("minScore", String(params.minScore));
  if (params.sort) query.set("sort", params.sort);

  const res = await fetch(`${API_BASE}/listings/filter?${query.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Filter request failed");
  return res.json();
}

export async function fetchFeaturedListings(): Promise<{ data: DeviceListingItem[] }> {
  const res = await fetch(`${API_BASE}/listings/featured`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch featured listings");
  return res.json();
}

export async function fetchListingById(id: string): Promise<{ data: DeviceListingItem }> {
  const res = await fetch(`${API_BASE}/listings/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Listing not found");
  return res.json();
}

export async function createListing(payload: any, token?: string): Promise<{ data: DeviceListingItem }> {
  const res = await fetch(`${API_BASE}/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to publish listing");
  }
  return res.json();
}

export async function uploadListingImages(files: File[]): Promise<{ urls: string[] }> {
  const formData = new FormData();
  files.forEach((file) => formData.append("images", file));

  const res = await fetch(`${API_BASE}/listings/upload-images`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to upload images");
  }
  return res.json();
}
