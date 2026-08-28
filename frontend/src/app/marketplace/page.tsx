"use client";

import React, { useState, Suspense, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { filterListings, searchListings, DeviceListingItem } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, getDeviceImageUrl } from "@/lib/utils";
import {
  Search,
  Star,
  Leaf,
  Cpu,
  Sparkles,
  ArrowUpDown,
  Check,
  Loader2,
  Package,
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  TabletSmartphone,
  Watch,
  Monitor,
  LayoutGrid,
  Layers,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Tag,
  TrendingDown,
  X,
  SlidersHorizontal,
} from "lucide-react";

// Category Definitions
const CATEGORIES = [
  { id: "All", label: "All Gadgets", icon: Sparkles },
  { id: "Phones", label: "Mobile Phones", icon: Smartphone },
  { id: "Laptops", label: "Laptops", icon: Laptop },
  { id: "Headphones", label: "Headphones & Audio", icon: Headphones },
  { id: "Tablets", label: "Tablets", icon: Tablet },
  { id: "iPads", label: "iPads", icon: TabletSmartphone },
  { id: "Smart Watches", label: "Smart Watches", icon: Watch },
  { id: "PCs / Desktop Computers", label: "PCs & Desktops", icon: Monitor },
];

// Category to Brands Mapping
const CATEGORY_BRANDS: Record<string, string[]> = {
  "All": ["Apple", "Samsung", "Dell", "Lenovo", "HP", "ASUS", "Acer", "Sony", "Bose", "JBL", "OnePlus", "Google", "Xiaomi", "Garmin", "Noise", "boAt"],
  "Phones": ["Apple", "Samsung", "OnePlus", "Google", "Xiaomi"],
  "Laptops": ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer"],
  "Headphones": ["Sony", "JBL", "Bose", "Apple", "Samsung"],
  "Tablets": ["Samsung", "Lenovo", "Xiaomi"],
  "iPads": ["Apple"],
  "Smart Watches": ["Apple", "Samsung", "Garmin", "Noise", "boAt"],
  "PCs / Desktop Computers": ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer"],
};

// Estimated original prices for budget discount percentage calculation
const ESTIMATED_ORIGINAL_PRICE: Record<string, number> = {
  "iPhone 15 Pro": 1199,
  "iPhone 14 Pro Max": 1299,
  "iPhone 13": 699,
  "Galaxy S24 Ultra": 1419,
  "Galaxy Z Fold 5": 1799,
  "OnePlus 12 5G": 799,
  "OnePlus Open": 1699,
  "Pixel 8 Pro": 999,
  "Pixel Fold": 1799,
  "Xiaomi 14 Pro": 999,
  "MacBook Pro 16 M3 Max": 3499,
  "MacBook Air 15 M2": 1499,
  "XPS 15 9530 OLED": 2299,
  "XPS 13 Plus 9320": 1549,
  "Spectre x360 16 2-in-1": 1899,
  "OMEN 16 Gaming": 1899,
  "ThinkPad X1 Carbon Gen 11": 1999,
  "Legion Pro 7i": 2699,
  "ROG Zephyrus G14 OLED": 1799,
  "Zenbook Pro 14 Duo": 2299,
  "Predator Helios 16": 1699,
  "Swift Go 14 OLED": 899,
  "WH-1000XM5 ANC": 399,
  "Tour One M2": 299,
  "QuietComfort Ultra": 429,
  "AirPods Max": 549,
  "Galaxy Buds2 Pro": 229,
  "Galaxy Tab S9 Ultra": 1199,
  "Tab P12 Pro": 699,
  "Xiaomi Pad 6 Max": 749,
  "iPad (10th Gen)": 449,
  "iPad Air M2 11\"": 699,
  "iPad Pro 12.9 M2": 1099,
  "iPad Mini (6th Gen)": 499,
  "Watch Ultra 2": 799,
  "Watch Series 9": 429,
  "Galaxy Watch 6 Classic": 399,
  "Fenix 7 Pro Sapphire Solar": 899,
  "ColorFit Pro 5 Max": 99,
  "Ultima Call Pro": 79,
  "Mac Studio M2 Max": 1999,
  "iMac 24\" 4.5K Retina M3": 1699,
  "Alienware Aurora R16": 2899,
  "OptiPlex 7010 Micro": 849,
  "OMEN 45L Gaming Desktop": 2499,
  "Legion Tower 7i": 2799,
  "ROG Strix G16CH": 1799,
  "Predator Orion 7000": 2699,
};

function MarketplaceContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [selectedCondition, setSelectedCondition] = useState<string>("ALL");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grouped" | "grid">("grouped");
  const [addingCartId, setAddingCartId] = useState<string | null>(null);

  // Available brands dynamically based on active category
  const availableBrands = useMemo(() => {
    return CATEGORY_BRANDS[selectedCategory] || CATEGORY_BRANDS["All"];
  }, [selectedCategory]);

  // Query API
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [
      "marketplace_listings",
      searchQuery,
      selectedCategory,
      selectedBrand,
      selectedCondition,
      maxPriceFilter,
      sortBy,
    ],
    queryFn: async () => {
      if (searchQuery.trim().length > 0) {
        return searchListings(searchQuery.trim());
      }
      return filterListings({
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        brand: selectedBrand !== "All" ? selectedBrand : undefined,
        condition: selectedCondition !== "ALL" ? selectedCondition : undefined,
        maxPrice: maxPriceFilter < 1000 ? maxPriceFilter : undefined,
        sort: sortBy,
      });
    },
  });

  const listings: DeviceListingItem[] = data?.data || [];

  // Group listings by brand for brand section view
  const listingsByBrand = useMemo(() => {
    const map = new Map<string, DeviceListingItem[]>();
    for (const item of listings) {
      const brand = item.device?.brand || "Other";
      if (!map.has(brand)) {
        map.set(brand, []);
      }
      map.get(brand)!.push(item);
    }
    return map;
  }, [listings]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedBrand("All"); // Reset brand selection when switching category
  };

  const handleSelectBrand = (brandName: string) => {
    setSelectedBrand(brandName);
  };

  const resetAllFilters = () => {
    setSelectedCategory("All");
    setSelectedBrand("All");
    setSelectedCondition("ALL");
    setMaxPriceFilter(1000);
    setSearchQuery("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedBrand !== "All" ||
    selectedCondition !== "ALL" ||
    maxPriceFilter < 1000 ||
    searchQuery.trim().length > 0;

  const handleAddToCart = async (item: DeviceListingItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setAddingCartId(item.id);
      await addToCart({
        id: `cart_${item.id}`,
        listingId: item.id,
        quantity: 1,
        listing: {
          id: item.id,
          title: item.title,
          price: item.price,
          condition: item.condition,
          images: item.images,
          device: item.device,
          seller: item.seller,
        },
      });
    } finally {
      setTimeout(() => setAddingCartId(null), 500);
    }
  };

  const handlePlaceOrder = async (item: DeviceListingItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/?redirect=${encodeURIComponent(`/listings/${item.id}`)}`);
      return;
    }
    await addToCart({
      id: `cart_${item.id}`,
      listingId: item.id,
      quantity: 1,
      listing: {
        id: item.id,
        title: item.title,
        price: item.price,
        condition: item.condition,
        images: item.images,
        device: item.device,
        seller: item.seller,
      },
    });
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-cream-50 pb-20">
      {/* ==================================================== */}
      {/* 1. HERO HEADER                                       */}
      {/* ==================================================== */}
      <div className="border-b border-cream-200 bg-gradient-to-r from-cream-100 via-cream-50 to-cream py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="burgundy" dot>
                  Refurbished Marketplace
                </Badge>
                <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> Up to 80% Off Retail
                </span>
              </div>
              <h1 className="text-2xl font-black text-brown-950 sm:text-3xl font-display">
                Certified Refurbished Electronics
              </h1>
              <p className="text-xs text-brown-600 mt-0.5">
                42-point inspected devices with 12-month warranties. Filter by category and brand below.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model, specs (e.g. iPhone 15, M3 Pro)..."
                className="w-full rounded-xl border border-cream-300 bg-white py-2 pl-10 pr-8 text-xs text-brown-900 placeholder:text-brown-400 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 hover:text-brown-700 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. UNIFIED SINGLE FILTER SYSTEM                      */}
      {/* ==================================================== */}
      <div className="border-b border-cream-200 bg-white sticky top-16 z-20 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 space-y-2.5">
          
          {/* A. CATEGORY FILTER ROW */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-burgundy text-white shadow-md shadow-burgundy/20 scale-[1.02]"
                      : "bg-cream-50 text-brown-800 border border-cream-200 hover:bg-cream-100 hover:text-burgundy hover:border-cream-300"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-burgundy"}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* B. DYNAMIC BRAND FILTER ROW */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-cream-100">
            <span className="text-[11px] font-bold text-brown-500 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3 text-burgundy" /> Brands:
            </span>
            <button
              onClick={() => handleSelectBrand("All")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedBrand === "All"
                  ? "bg-brown-950 text-white shadow-xs"
                  : "bg-cream-100 text-brown-700 hover:bg-cream-200"
              }`}
            >
              All Brands
            </button>
            {availableBrands.map((brand) => {
              const isSelected = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => handleSelectBrand(brand)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 border cursor-pointer ${
                    isSelected
                      ? "bg-burgundy text-white border-burgundy shadow-xs"
                      : "bg-white border-cream-200 text-brown-800 hover:bg-cream-100 hover:border-cream-300"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          {/* C. SECONDARY CONTROLS & STATUS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-cream-100 text-xs">
            {/* Active Criteria Status & Reset */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-brown-700">
                Showing <strong className="text-brown-950 font-bold">{listings.length}</strong> devices
              </span>

              {selectedCategory !== "All" && (
                <Badge variant="burgundy" className="text-[11px] py-0.5">
                  Category: {selectedCategory}
                </Badge>
              )}

              {selectedBrand !== "All" && (
                <Badge variant="cream" className="text-[11px] py-0.5">
                  Brand: {selectedBrand}
                </Badge>
              )}

              {selectedCondition !== "ALL" && (
                <Badge variant="pristine" className="text-[11px] py-0.5">
                  Grade: {selectedCondition}
                </Badge>
              )}

              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-xs font-bold text-burgundy hover:underline flex items-center gap-1 ml-1 cursor-pointer"
                >
                  <X className="h-3 w-3" /> Reset All Filters
                </button>
              )}
            </div>

            {/* Filter Dropdowns & View Mode Switcher */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Condition Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-brown-500 font-medium">Condition:</span>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="rounded-lg border border-cream-300 bg-cream-50 px-2 py-1 text-xs text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy cursor-pointer"
                >
                  <option value="ALL">All Conditions</option>
                  <option value="PRISTINE">Grade A+ Pristine</option>
                  <option value="EXCELLENT">Grade A Excellent</option>
                  <option value="GOOD">Grade B Good</option>
                </select>
              </div>

              {/* Max Budget Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-brown-500 font-medium">Budget:</span>
                <select
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="rounded-lg border border-cream-300 bg-cream-50 px-2 py-1 text-xs text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy cursor-pointer"
                >
                  <option value={1000}>All Prices</option>
                  <option value={200}>Under $200</option>
                  <option value={350}>Under $350</option>
                  <option value={500}>Under $500</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5">
                <span className="text-brown-500 font-medium">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-cream-300 bg-cream-50 px-2 py-1 text-xs text-brown-900 focus:outline-none focus:ring-1 focus:ring-burgundy cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="score_desc">AI Health Score</option>
                </select>
              </div>

              {/* View Mode Toggle: Brand Sections vs All Grid */}
              <div className="flex items-center bg-cream-100 rounded-lg p-0.5 border border-cream-200">
                <button
                  onClick={() => setViewMode("grouped")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "grouped"
                      ? "bg-white text-burgundy shadow-xs"
                      : "text-brown-600 hover:text-brown-900"
                  }`}
                  title="Organize products by brand sections"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Brand Sections</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-white text-burgundy shadow-xs"
                      : "text-brown-600 hover:text-brown-900"
                  }`}
                  title="Fluid grid view"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span>All Grid</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. PRODUCT LISTINGS CONTENT                          */}
      {/* ==================================================== */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3 bg-white rounded-2xl border border-cream-200 p-12">
            <Loader2 className="h-8 w-8 animate-spin text-burgundy" />
            <p className="text-xs text-brown-600 font-semibold">Loading certified refurbished devices...</p>
          </div>
        ) : listings.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-cream-300 bg-white p-12 text-center shadow-warm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cream-100 text-brown-500 mb-3">
              <Package className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-brown-950 font-display">No devices found</h3>
            <p className="text-xs text-brown-600 max-w-md mx-auto mt-1 mb-4">
              No products matched the filter: <strong>{selectedCategory}</strong>
              {selectedBrand !== "All" && ` + ${selectedBrand}`}. Try clearing your active filters.
            </p>
            <Button variant="outline" size="sm" onClick={resetAllFilters}>
              Reset All Filters
            </Button>
          </div>
        ) : viewMode === "grouped" ? (
          /* ==================================================== */
          /* BRAND-WISE SECTIONS VIEW                             */
          /* ==================================================== */
          <div className="space-y-12">
            {Array.from(listingsByBrand.entries()).map(([brandName, brandItems]) => (
              <div key={brandName} className="space-y-4">
                {/* Brand Section Header */}
                <div className="flex items-center justify-between border-b-2 border-cream-300 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-burgundy text-white font-black text-sm shadow-xs">
                      {brandName.slice(0, 1)}
                    </span>
                    <h3 className="text-xl font-black text-brown-950 font-display">
                      {brandName} {selectedCategory !== "All" ? selectedCategory : "Collection"}
                    </h3>
                    <Badge variant="cream" className="text-[11px] font-bold">
                      {brandItems.length} {brandItems.length === 1 ? "Device" : "Devices"}
                    </Badge>
                  </div>

                  <span className="text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg hidden sm:inline">
                    12-Month Certified Warranty
                  </span>
                </div>

                {/* 4-Column Product Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {brandItems.map((item) => (
                    <ProductCard
                      key={item.id}
                      item={item}
                      isAddingToCart={addingCartId === item.id}
                      onAddToCart={(e) => handleAddToCart(item, e)}
                      onPlaceOrder={(e) => handlePlaceOrder(item, e)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ==================================================== */
          /* ALL GRID VIEW                                        */
          /* ==================================================== */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                isAddingToCart={addingCartId === item.id}
                onAddToCart={(e) => handleAddToCart(item, e)}
                onPlaceOrder={(e) => handlePlaceOrder(item, e)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Product Card Component
// ----------------------------------------------------
function ProductCard({
  item,
  isAddingToCart,
  onAddToCart,
  onPlaceOrder,
}: {
  item: DeviceListingItem;
  isAddingToCart: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
  onPlaceOrder: (e: React.MouseEvent) => void;
}) {
  const score = item.device?.secondLifeScores?.[0]?.score || 96.0;
  const carbon = item.device?.sustainabilityRecords?.[0]?.co2SavedKg || 54.0;
  const sellerProfile = item.seller?.sellerProfile;
  const firstImage = getDeviceImageUrl(item.images);
  const categoryLabel = item.device?.category || "Gadget";

  // Calculate estimated original retail price and savings percentage
  const originalPrice = ESTIMATED_ORIGINAL_PRICE[item.device?.model] || Math.round(item.price * 2.8);
  const savingsPct = Math.max(40, Math.min(85, Math.round(((originalPrice - item.price) / originalPrice) * 100)));

  return (
    <Card
      hoverEffect
      className="flex flex-col justify-between overflow-hidden border-cream-300 p-4 bg-white group rounded-2xl transition-all duration-300 hover:shadow-lg"
    >
      <div>
        {/* Device Image Container */}
        <Link href={`/listings/${item.id}`}>
          <div className="relative h-48 w-full overflow-hidden rounded-xl bg-cream-100">
            <Image
              src={firstImage}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Condition Tag & Category Chip */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              <Badge
                variant={
                  item.condition === "PRISTINE"
                    ? "pristine"
                    : item.condition === "EXCELLENT"
                    ? "excellent"
                    : "good"
                }
              >
                {item.condition === "PRISTINE" ? "Grade A+ Like New" : item.condition}
              </Badge>
              <span className="rounded-md bg-brown-950/80 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs backdrop-blur-xs">
                {categoryLabel}
              </span>
            </div>

            {/* Savings Badge */}
            <div className="absolute top-2 right-2 rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-extrabold text-white shadow-md flex items-center gap-1">
              <Tag className="h-3 w-3" /> Save {savingsPct}%
            </div>

            {/* 12-Month Warranty Badge */}
            <div className="absolute bottom-2 right-2 rounded-lg bg-brown-950/85 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              12 Mo. Warranty
            </div>
          </div>
        </Link>

        {/* Details */}
        <div className="pt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-brown-500">
            <span className="font-bold text-brown-800">
              {item.device?.brand} • {item.device?.storage !== "N/A" ? item.device?.storage : item.device?.color}
            </span>
            <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md text-[11px]">
              <Leaf className="h-3 w-3 text-emerald-600" /> -{carbon}kg CO₂
            </span>
          </div>

          <Link href={`/listings/${item.id}`}>
            <h4 className="font-bold text-brown-950 leading-snug font-display line-clamp-2 hover:text-burgundy transition-colors text-xs">
              {item.title}
            </h4>
          </Link>

          {/* Second-Life Score & Seller */}
          <div className="flex items-center justify-between pt-1">
            <span className="flex items-center gap-1 rounded-md bg-burgundy/10 px-2 py-0.5 text-[10px] font-bold text-burgundy">
              <Cpu className="h-3 w-3" />
              AI Score: {score}/100
            </span>

            <div className="flex items-center gap-1 text-xs text-brown-600 font-medium">
              <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
              <span className="text-[11px]">{sellerProfile?.rating ? sellerProfile.rating.toFixed(1) : "4.9"}</span>
              {sellerProfile?.verified && (
                <Badge variant="pristine" className="text-[8px] py-0 px-1">
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: Budget Price & Direct Action CTAs */}
      <div className="pt-3 border-t border-cream-200 mt-3 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-burgundy font-display">
                {formatPrice(item.price)}
              </span>
              <span className="text-[11px] text-brown-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            </div>
            <span className="text-[9px] text-emerald-700 font-bold">
              Refurbished Deal
            </span>
          </div>
          <span className="text-[11px] text-brown-500 font-medium capitalize">
            {item.device?.color}
          </span>
        </div>

        {/* Side-by-Side Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddToCart}
            disabled={isAddingToCart}
            className="w-full text-xs font-bold flex items-center justify-center gap-1 border-burgundy/30 text-burgundy hover:bg-burgundy/5 py-1.5 cursor-pointer"
          >
            <ShoppingCart className="h-3 w-3" />
            {isAddingToCart ? "Added!" : "Add to Cart"}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onPlaceOrder}
            className="w-full text-xs font-bold flex items-center justify-center gap-1 py-1.5 cursor-pointer"
          >
            <Zap className="h-3 w-3" />
            Place Order
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-burgundy" />
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
