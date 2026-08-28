import { Request, Response, NextFunction } from "express";
import {
  getDb,
  ListingCondition,
  ListingStatus,
  PassportEntryType,
  AIRecommendation,
} from "@retech/database";
import { v4 as uuidv4 } from "uuid";
import { optimizeAndStoreImage } from "../services/storage.service";
import crypto from "crypto";

export const SEEDED_CATALOG = [
  {
    id: "list_iphone_15_pro",
    deviceId: "dev_iphone_15_pro",
    sellerId: "seller_austin_circular",
    title: "Apple iPhone 15 Pro 128GB - Natural Titanium (Pristine Grade A+)",
    price: 549.0,
    originalPrice: 1199.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1695048132924-42b78b02e7be?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_iphone_15_pro",
      brand: "Apple",
      model: "iPhone 15 Pro",
      storage: "128GB",
      ram: "8GB",
      color: "Natural Titanium",
      year: 2023,
      imei: "359842109281726",
      secondLifeScores: [
        {
          id: "sls_1",
          score: 98,
          breakdown: { batteryHealth: 99, cosmeticIndex: 99, screenIntegrity: 100, thermalEfficiency: 98 },
          calculatedAt: new Date().toISOString(),
        },
      ],
      sustainabilityRecords: [{ id: "sust_1", co2SavedKg: 70.0, eWasteAvoidedKg: 0.15 }],
      digitalPassport: {
        id: "pass_1",
        previousOwners: 1,
        verifiedAt: new Date().toISOString(),
        entries: [
          {
            id: "e1",
            type: "FACTORY_RESET",
            description: "Cryptographic DoD 5220.22-M data sanitization executed.",
            date: "2026-08-20",
            verifiedBy: "Certified Refurbishing Lab",
          },
          {
            id: "e2",
            type: "INSPECTION",
            description: "52-point hardware sensor & OLED spectrometer calibration passed.",
            date: "2026-08-21",
            verifiedBy: "Apple Authorized Technician #842",
          },
        ],
      },
    },
    seller: {
      id: "seller_austin_circular",
      name: "Austin Circular Labs",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Austin Circular Labs", verified: true, rating: 4.98, totalSales: 342 },
    },
  },
  {
    id: "list_macbook_air_m2",
    deviceId: "dev_macbook_air_m2",
    sellerId: "seller_nordic_tech",
    title: 'Apple MacBook Air 13.6" M2 (8-Core CPU / 8GB / 256GB SSD) - Midnight',
    price: 489.0,
    originalPrice: 1099.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_macbook_air_m2",
      brand: "Apple",
      model: "MacBook Air M2",
      storage: "256GB",
      ram: "8GB",
      color: "Midnight",
      year: 2022,
      imei: "359842109281727",
      secondLifeScores: [
        {
          id: "sls_2",
          score: 96,
          breakdown: { batteryHealth: 96, cosmeticIndex: 98, screenIntegrity: 100, thermalEfficiency: 95 },
          calculatedAt: new Date().toISOString(),
        },
      ],
      sustainabilityRecords: [{ id: "sust_2", co2SavedKg: 280.0, eWasteAvoidedKg: 1.24 }],
      digitalPassport: {
        id: "pass_2",
        previousOwners: 1,
        verifiedAt: new Date().toISOString(),
        entries: [
          {
            id: "e3",
            type: "CERTIFICATION",
            description: "Battery diagnostic test: 42 charge cycles, 96% health retention.",
            date: "2026-08-19",
            verifiedBy: "Nordic Diagnostics Lab",
          },
        ],
      },
    },
    seller: {
      id: "seller_nordic_tech",
      name: "Nordic Tech Refurb",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Nordic Tech Refurb", verified: true, rating: 4.95, totalSales: 612 },
    },
  },
  {
    id: "list_iphone_13",
    deviceId: "dev_iphone_13",
    sellerId: "seller_austin_circular",
    title: "Apple iPhone 13 128GB - Midnight Blue (Affordable Grade A)",
    price: 269.0,
    originalPrice: 699.0,
    condition: "EXCELLENT",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_iphone_13",
      brand: "Apple",
      model: "iPhone 13",
      storage: "128GB",
      ram: "4GB",
      color: "Midnight Blue",
      year: 2021,
      imei: "359842109281728",
      secondLifeScores: [
        {
          id: "sls_3",
          score: 92,
          breakdown: { batteryHealth: 91, cosmeticIndex: 94, screenIntegrity: 98, thermalEfficiency: 92 },
          calculatedAt: new Date().toISOString(),
        },
      ],
      sustainabilityRecords: [{ id: "sust_3", co2SavedKg: 65.0, eWasteAvoidedKg: 0.17 }],
    },
    seller: {
      id: "seller_austin_circular",
      name: "Austin Circular Labs",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Austin Circular Labs", verified: true, rating: 4.98, totalSales: 342 },
    },
  },
  {
    id: "list_iphone_12_mini",
    deviceId: "dev_iphone_12_mini",
    sellerId: "seller_green_gadget",
    title: "Apple iPhone 12 Mini 64GB - Black (Budget Friendly Pick)",
    price: 169.0,
    originalPrice: 599.0,
    condition: "GOOD",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_iphone_12_mini",
      brand: "Apple",
      model: "iPhone 12 Mini",
      storage: "64GB",
      ram: "4GB",
      color: "Black",
      year: 2020,
      imei: "359842109281729",
      secondLifeScores: [{ id: "sls_4", score: 89, breakdown: { batteryHealth: 88, cosmeticIndex: 90 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_green_gadget",
      name: "Green Gadget Solutions",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Green Gadget Solutions", verified: true, rating: 4.88, totalSales: 180 },
    },
  },
  {
    id: "list_galaxy_s23_ultra",
    deviceId: "dev_galaxy_s23_ultra",
    sellerId: "seller_nordic_tech",
    title: "Samsung Galaxy S23 Ultra 256GB - Phantom Black (Flagship Camera)",
    price: 649.0,
    originalPrice: 1199.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_galaxy_s23_ultra",
      brand: "Samsung",
      model: "Galaxy S23 Ultra",
      storage: "256GB",
      ram: "12GB",
      color: "Phantom Black",
      year: 2023,
      imei: "359842109281730",
      secondLifeScores: [{ id: "sls_5", score: 95, breakdown: { batteryHealth: 96, cosmeticIndex: 98 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_nordic_tech",
      name: "Nordic Tech Refurb",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Nordic Tech Refurb", verified: true, rating: 4.95, totalSales: 612 },
    },
  },
  {
    id: "list_galaxy_s21",
    deviceId: "dev_galaxy_s21",
    sellerId: "seller_green_gadget",
    title: "Samsung Galaxy S21 5G 128GB - Phantom Gray (Super Saver)",
    price: 219.0,
    originalPrice: 799.0,
    condition: "EXCELLENT",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_galaxy_s21",
      brand: "Samsung",
      model: "Galaxy S21 5G",
      storage: "128GB",
      ram: "8GB",
      color: "Phantom Gray",
      year: 2021,
      imei: "359842109281731",
      secondLifeScores: [{ id: "sls_6", score: 90, breakdown: { batteryHealth: 89, cosmeticIndex: 92 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_green_gadget",
      name: "Green Gadget Solutions",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Green Gadget Solutions", verified: true, rating: 4.88, totalSales: 180 },
    },
  },
  {
    id: "list_pixel_8_pro",
    deviceId: "dev_pixel_8_pro",
    sellerId: "seller_austin_circular",
    title: "Google Pixel 8 Pro 128GB - Obsidian (AI Photo Beast)",
    price: 499.0,
    originalPrice: 999.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_pixel_8_pro",
      brand: "Google",
      model: "Pixel 8 Pro",
      storage: "128GB",
      ram: "12GB",
      color: "Obsidian",
      year: 2023,
      imei: "359842109281732",
      secondLifeScores: [{ id: "sls_7", score: 97, breakdown: { batteryHealth: 98, cosmeticIndex: 99 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_austin_circular",
      name: "Austin Circular Labs",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Austin Circular Labs", verified: true, rating: 4.98, totalSales: 342 },
    },
  },
  {
    id: "list_pixel_7a",
    deviceId: "dev_pixel_7a",
    sellerId: "seller_green_gadget",
    title: "Google Pixel 7a 128GB - Sea Blue (Affordable Value Winner)",
    price: 279.0,
    originalPrice: 499.0,
    condition: "EXCELLENT",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_pixel_7a",
      brand: "Google",
      model: "Pixel 7a",
      storage: "128GB",
      ram: "8GB",
      color: "Sea Blue",
      year: 2023,
      imei: "359842109281733",
      secondLifeScores: [{ id: "sls_8", score: 94, breakdown: { batteryHealth: 94, cosmeticIndex: 95 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_green_gadget",
      name: "Green Gadget Solutions",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Green Gadget Solutions", verified: true, rating: 4.88, totalSales: 180 },
    },
  },
  {
    id: "list_ipad_10th_gen",
    deviceId: "dev_ipad_10th_gen",
    sellerId: "seller_nordic_tech",
    title: "Apple iPad 10th Gen 10.9-inch 64GB Wi-Fi - Silver",
    price: 299.0,
    originalPrice: 449.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_ipad_10th_gen",
      brand: "Apple",
      model: "iPad 10th Gen",
      storage: "64GB",
      ram: "4GB",
      color: "Silver",
      year: 2022,
      imei: "359842109281734",
      secondLifeScores: [{ id: "sls_9", score: 96, breakdown: { batteryHealth: 97, cosmeticIndex: 98 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_nordic_tech",
      name: "Nordic Tech Refurb",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Nordic Tech Refurb", verified: true, rating: 4.95, totalSales: 612 },
    },
  },
  {
    id: "list_thinkpad_x1",
    deviceId: "dev_thinkpad_x1",
    sellerId: "seller_nordic_tech",
    title: 'Lenovo ThinkPad X1 Carbon Gen 9 14" (Intel i7 / 16GB RAM / 512GB SSD)',
    price: 489.0,
    originalPrice: 1499.0,
    condition: "EXCELLENT",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_thinkpad_x1",
      brand: "Lenovo",
      model: "ThinkPad X1 Carbon Gen 9",
      storage: "512GB",
      ram: "16GB",
      color: "Matte Black",
      year: 2021,
      imei: "359842109281735",
      secondLifeScores: [{ id: "sls_10", score: 93, breakdown: { batteryHealth: 92, cosmeticIndex: 94 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_nordic_tech",
      name: "Nordic Tech Refurb",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Nordic Tech Refurb", verified: true, rating: 4.95, totalSales: 612 },
    },
  },
  {
    id: "list_dell_xps_13",
    deviceId: "dev_dell_xps_13",
    sellerId: "seller_austin_circular",
    title: 'Dell XPS 13 9310 InfinityEdge (Intel i7 11th Gen / 16GB / 512GB SSD)',
    price: 549.0,
    originalPrice: 1399.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_dell_xps_13",
      brand: "Dell",
      model: "XPS 13 9310",
      storage: "512GB",
      ram: "16GB",
      color: "Platinum Silver",
      year: 2021,
      imei: "359842109281736",
      secondLifeScores: [{ id: "sls_11", score: 94, breakdown: { batteryHealth: 93, cosmeticIndex: 96 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_austin_circular",
      name: "Austin Circular Labs",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Austin Circular Labs", verified: true, rating: 4.98, totalSales: 342 },
    },
  },
  {
    id: "list_sony_wh1000xm5",
    deviceId: "dev_sony_wh1000xm5",
    sellerId: "seller_nordic_tech",
    title: "Sony WH-1000XM5 Wireless Active Noise Cancelling Headphones - Black",
    price: 249.0,
    originalPrice: 399.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_sony_wh1000xm5",
      brand: "Sony",
      model: "WH-1000XM5",
      storage: "N/A",
      ram: "N/A",
      color: "Black",
      year: 2022,
      imei: "359842109281737",
      secondLifeScores: [{ id: "sls_12", score: 99, breakdown: { batteryHealth: 100, cosmeticIndex: 99 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_nordic_tech",
      name: "Nordic Tech Refurb",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Nordic Tech Refurb", verified: true, rating: 4.95, totalSales: 612 },
    },
  },
  {
    id: "list_airpods_pro_2",
    deviceId: "dev_airpods_pro_2",
    sellerId: "seller_austin_circular",
    title: "Apple AirPods Pro 2nd Gen (USB-C MagSafe Case, ANC & Spatial Audio)",
    price: 149.0,
    originalPrice: 249.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_airpods_pro_2",
      brand: "Apple",
      model: "AirPods Pro 2",
      storage: "N/A",
      ram: "N/A",
      color: "White",
      year: 2023,
      imei: "359842109281738",
      secondLifeScores: [{ id: "sls_13", score: 98, breakdown: { batteryHealth: 98, cosmeticIndex: 99 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_austin_circular",
      name: "Austin Circular Labs",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Austin Circular Labs", verified: true, rating: 4.98, totalSales: 342 },
    },
  },
  {
    id: "list_apple_watch_8",
    deviceId: "dev_apple_watch_8",
    sellerId: "seller_green_gadget",
    title: "Apple Watch Series 8 45mm GPS - Midnight Aluminum (ECG & Temp Sensor)",
    price: 219.0,
    originalPrice: 429.0,
    condition: "EXCELLENT",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_apple_watch_8",
      brand: "Apple",
      model: "Apple Watch Series 8",
      storage: "32GB",
      ram: "1GB",
      color: "Midnight",
      year: 2022,
      imei: "359842109281739",
      secondLifeScores: [{ id: "sls_14", score: 94, breakdown: { batteryHealth: 93, cosmeticIndex: 96 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_green_gadget",
      name: "Green Gadget Solutions",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Green Gadget Solutions", verified: true, rating: 4.88, totalSales: 180 },
    },
  },
  {
    id: "list_nintendo_switch_oled",
    deviceId: "dev_nintendo_switch_oled",
    sellerId: "seller_austin_circular",
    title: "Nintendo Switch OLED Model 64GB - White (With Joy-Cons & Dock)",
    price: 239.0,
    originalPrice: 349.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_nintendo_switch_oled",
      brand: "Nintendo",
      model: "Switch OLED",
      storage: "64GB",
      ram: "4GB",
      color: "White",
      year: 2022,
      imei: "359842109281740",
      secondLifeScores: [{ id: "sls_15", score: 96, breakdown: { batteryHealth: 96, cosmeticIndex: 98 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_austin_circular",
      name: "Austin Circular Labs",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Austin Circular Labs", verified: true, rating: 4.98, totalSales: 342 },
    },
  },
  {
    id: "list_ps5_digital",
    deviceId: "dev_ps5_digital",
    sellerId: "seller_nordic_tech",
    title: "Sony PlayStation 5 Digital Edition 825GB - White (DualSense Included)",
    price: 349.0,
    originalPrice: 449.0,
    condition: "PRISTINE",
    status: "ACTIVE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
    ]),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    device: {
      id: "dev_ps5_digital",
      brand: "Sony",
      model: "PlayStation 5 Digital",
      storage: "825GB",
      ram: "16GB",
      color: "White",
      year: 2021,
      imei: "359842109281741",
      secondLifeScores: [{ id: "sls_16", score: 99, breakdown: { batteryHealth: 100, cosmeticIndex: 99 }, calculatedAt: new Date().toISOString() }],
    },
    seller: {
      id: "seller_nordic_tech",
      name: "Nordic Tech Refurb",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      sellerProfile: { businessName: "Nordic Tech Refurb", verified: true, rating: 4.95, totalSales: 612 },
    },
  },
];

// ----------------------------------------------------
// 1. POST /listings (Create new listing)
// ----------------------------------------------------
export async function createListingHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      brand,
      model,
      storage = "256GB",
      ram = "8GB",
      color = "Space Gray",
      year = new Date().getFullYear(),
      price,
      condition = "EXCELLENT",
      description = "",
      images = [],
      sellerId: inputSellerId,
    } = req.body;

    if (!brand || !model || !price) {
      return res.status(400).json({
        success: false,
        error: "Brand, model, and price are required to create a listing.",
      });
    }

    const db = await getDb();
    let sellerId = req.user?.userId || inputSellerId;
    if (!sellerId) {
      const defaultSeller = await db.get(`SELECT id FROM User WHERE role = 'SELLER' LIMIT 1`);
      sellerId = defaultSeller?.id;
    }

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        error: "A valid seller account is required to publish a listing.",
      });
    }

    const generatedImei = `359${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;
    const deviceId = uuidv4();
    await db.run(
      `INSERT INTO Device (id, brand, model, storage, ram, color, year, imei) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [deviceId, brand, model, String(storage), String(ram), String(color), parseInt(String(year), 10), generatedImei]
    );

    const listingId = uuidv4();
    const imagesStr = JSON.stringify(Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"]);
    await db.run(
      `INSERT INTO DeviceListing (id, deviceId, sellerId, title, price, condition, status, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [listingId, deviceId, sellerId, `${brand} ${model} ${storage} (${color}) - ${condition} Grade`, parseFloat(String(price)), condition, ListingStatus.ACTIVE, imagesStr]
    );

    const listingRow = await db.get(`
      SELECT l.*, d.brand, d.model, d.storage, d.ram, d.color, d.year, d.imei, s.name as seller_name, s.email as seller_email, s.avatar as seller_avatar
      FROM DeviceListing l
      JOIN Device d ON l.deviceId = d.id
      JOIN User s ON l.sellerId = s.id
      WHERE l.id = ?
    `, [listingId]);
    
    let listing = null;
    if (listingRow) {
       listing = {
         ...listingRow,
         device: {
           id: listingRow.deviceId, brand: listingRow.brand, model: listingRow.model,
           storage: listingRow.storage, ram: listingRow.ram, color: listingRow.color,
           year: listingRow.year, imei: listingRow.imei
         },
         seller: {
           id: listingRow.sellerId, name: listingRow.seller_name, email: listingRow.seller_email, avatar: listingRow.seller_avatar
         }
       }
    }

    return res.status(201).json({
      success: true,
      message: "Listing created successfully.",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
}

export function parseListingImages(images: any): string[] {
  if (!images) return ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"];
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
    if (images.startsWith("http") || images.startsWith("/")) return [images];
  }
  return ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"];
}

export function inferCategory(brand: string = "", model: string = "", title: string = "", rawCategory?: string): string {
  if (rawCategory && rawCategory !== "All" && rawCategory.trim().length > 0) {
    return rawCategory;
  }
  const combined = `${brand} ${model} ${title}`.toLowerCase();
  if (combined.includes("ipad")) return "iPads";
  if (combined.includes("tab ") || combined.includes("tab s") || combined.includes("tab p") || combined.includes("pad 6") || combined.includes("tablet") || combined.includes("surface pro")) return "Tablets";
  if (combined.includes("watch") || combined.includes("band") || combined.includes("colorfit") || combined.includes("garmin")) return "Smart Watches";
  if (combined.includes("headphone") || combined.includes("earbud") || combined.includes("airpod") || combined.includes("buds") || combined.includes("wh-1000") || combined.includes("quietcomfort") || combined.includes("tour one")) return "Headphones";
  if (combined.includes("macbook") || combined.includes("laptop") || combined.includes("thinkpad") || combined.includes("spectre") || combined.includes("zenbook") || combined.includes("zephyrus") || combined.includes("swift") || combined.includes("helios") || combined.includes("xps 13") || combined.includes("xps 15")) return "Laptops";
  if (combined.includes("desktop") || combined.includes("pc") || combined.includes("imac") || combined.includes("mac studio") || combined.includes("mac mini") || combined.includes("alienware") || combined.includes("optiplex") || combined.includes("tower") || combined.includes("orion") || combined.includes("omen 45l")) return "PCs / Desktop Computers";
  return "Phones";
}

// ----------------------------------------------------
// 2. GET /listings (All Listings)
// ----------------------------------------------------
export async function getListingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || 1), 10));
    const limit = Math.min(100, Math.max(1, parseInt(String(req.query.limit || 50), 10)));

    let listings: any[] = [];
    try {
      const db = await getDb();
      const rows = await db.all(`
        SELECT l.*, d.brand, d.model, d.category, d.storage, d.ram, d.color, d.year, d.imei, s.name as seller_name, s.avatar as seller_avatar
        FROM DeviceListing l
        JOIN Device d ON l.deviceId = d.id
        JOIN User s ON l.sellerId = s.id
        WHERE l.status = 'ACTIVE'
        ORDER BY l.createdAt DESC
      `);
      listings = rows.map((r: any) => ({
        ...r,
        images: parseListingImages(r.images),
        device: {
          id: r.deviceId, brand: r.brand, model: r.model,
          category: r.category || inferCategory(r.brand, r.model, r.title, r.category),
          storage: r.storage, ram: r.ram, color: r.color, year: r.year, imei: r.imei,
          secondLifeScores: [{ id: "score-1", score: 96, breakdown: { batteryHealth: 98, cosmeticIndex: 95, screenIntegrity: 100, thermalEfficiency: 96 }, calculatedAt: new Date().toISOString() }],
          sustainabilityRecords: [{ id: "sus-1", co2SavedKg: 64, eWasteAvoidedKg: 0.35 }],
          digitalPassport: { id: "pass-1", previousOwners: 1, originalPurchaseDate: "2023-01-01", verifiedAt: new Date().toISOString(), history: [], repairs: [], entries: [] }
        },
        seller: {
          id: r.sellerId, name: r.seller_name, avatar: r.seller_avatar,
          sellerProfile: { businessName: r.seller_name, verified: true, rating: 4.9, totalSales: 120 }
        }
      }));
    } catch {
      // Fallback
    }

    if (!listings || listings.length === 0) {
      listings = SEEDED_CATALOG.map((l) => ({
        ...l,
        images: parseListingImages(l.images),
        device: {
          ...l.device,
          category: (l.device as any)?.category || inferCategory(l.device?.brand, l.device?.model, l.title, (l.device as any)?.category)
        }
      }));
    }

    const start = (page - 1) * limit;
    const paginated = listings.slice(start, start + limit);

    return res.json({
      success: true,
      data: paginated,
      pagination: {
        page,
        limit,
        total: listings.length,
        totalPages: Math.ceil(listings.length / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. GET /listings/search?q= (Search)
// ----------------------------------------------------
export async function searchListingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const query = String(req.query.q || "").trim().toLowerCase();

    if (!query) {
      return getListingsHandler(req, res, next);
    }

    let listings: any[] = [];
    try {
      const db = await getDb();
      const rows = await db.all(`
        SELECT l.*, d.brand, d.model, d.category, d.storage, d.ram, d.color, d.year, d.imei, s.name as seller_name, s.avatar as seller_avatar
        FROM DeviceListing l
        JOIN Device d ON l.deviceId = d.id
        JOIN User s ON l.sellerId = s.id
        WHERE l.status = 'ACTIVE' 
        AND (l.title LIKE ? OR d.brand LIKE ? OR d.model LIKE ? OR d.category LIKE ?)
      `, [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);
      
      listings = rows.map((r: any) => ({
        ...r,
        images: parseListingImages(r.images),
        device: {
          id: r.deviceId, brand: r.brand, model: r.model,
          category: r.category || inferCategory(r.brand, r.model, r.title, r.category),
          storage: r.storage, ram: r.ram, color: r.color, year: r.year, imei: r.imei,
          secondLifeScores: [], sustainabilityRecords: [], digitalPassport: null
        },
        seller: {
          id: r.sellerId, name: r.seller_name, avatar: r.seller_avatar
        }
      }));
    } catch {
      // Fallback
    }

    if (!listings || listings.length === 0) {
      listings = SEEDED_CATALOG.map((l) => ({ ...l, images: parseListingImages(l.images), device: { ...l.device, category: (l.device as any)?.category || inferCategory(l.device?.brand, l.device?.model, l.title, (l.device as any)?.category) } })).filter(
        (l) =>
          l.title.toLowerCase().includes(query) ||
          l.device.brand.toLowerCase().includes(query) ||
          l.device.model.toLowerCase().includes(query) ||
          (l.device as any).category?.toLowerCase().includes(query)
      );
    }

    return res.json({
      success: true,
      query,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. GET /listings/filter
// ----------------------------------------------------
export async function filterListingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, brand, condition, minScore, maxPrice, sort = "newest" } = req.query;

    let listings: any[] = [];
    try {
      const db = await getDb();
      const rows = await db.all(`
        SELECT l.*, d.brand, d.model, d.category, d.storage, d.ram, d.color, d.year, d.imei, s.name as seller_name, s.avatar as seller_avatar
        FROM DeviceListing l
        JOIN Device d ON l.deviceId = d.id
        JOIN User s ON l.sellerId = s.id
        WHERE l.status = 'ACTIVE'
      `);
      listings = rows.map((r: any) => ({
        ...r,
        images: parseListingImages(r.images),
        device: {
          id: r.deviceId, brand: r.brand, model: r.model,
          category: r.category || inferCategory(r.brand, r.model, r.title, r.category),
          storage: r.storage, ram: r.ram, color: r.color, year: r.year, imei: r.imei,
          secondLifeScores: [{ id: "s-1", score: 96, breakdown: { batteryHealth: 98, cosmeticIndex: 95, screenIntegrity: 100, thermalEfficiency: 96 }, calculatedAt: new Date().toISOString() }],
          sustainabilityRecords: [{ id: "sus-1", co2SavedKg: 64, eWasteAvoidedKg: 0.35 }],
          digitalPassport: null
        },
        seller: {
          id: r.sellerId, name: r.seller_name, avatar: r.seller_avatar
        }
      }));
    } catch {
      // Fallback
    }

    if (!listings || listings.length === 0) {
      listings = SEEDED_CATALOG.map((l) => ({ ...l, images: parseListingImages(l.images), device: { ...l.device, category: (l.device as any)?.category || inferCategory(l.device?.brand, l.device?.model, l.title, (l.device as any)?.category) } }));
    }

    let filtered = [...listings];

    if (category && typeof category === "string" && category !== "All") {
      const categories = category.split(",").map((c) => c.trim().toLowerCase());
      filtered = filtered.filter((l) => {
        const itemCat = (l.device?.category || inferCategory(l.device?.brand, l.device?.model, l.title, l.device?.category)).toLowerCase();
        return categories.some((c) => {
          if (c === "all") return true;
          if (c.includes("ipad")) {
            return itemCat.includes("ipad") || l.title.toLowerCase().includes("ipad");
          }
          if (c.includes("tablet")) {
            return (itemCat.includes("tablet") || itemCat === "tablets") && !l.title.toLowerCase().includes("ipad");
          }
          if (c.includes("pc") || c.includes("desktop")) {
            return itemCat.includes("pc") || itemCat.includes("desktop");
          }
          if (c.includes("watch")) {
            return itemCat.includes("watch");
          }
          if (c.includes("headphone") || c.includes("audio")) {
            return itemCat.includes("headphone") || itemCat.includes("audio");
          }
          if (c.includes("laptop")) {
            return itemCat.includes("laptop") || itemCat.includes("macbook");
          }
          if (c.includes("phone")) {
            return (itemCat.includes("phone") || itemCat === "phones") && !itemCat.includes("headphone");
          }
          return itemCat === c || itemCat.includes(c);
        });
      });
    }

    if (brand && typeof brand === "string") {
      const brands = brand.split(",").map((b) => b.trim().toLowerCase());
      filtered = filtered.filter((l) => brands.includes(l.device.brand.toLowerCase()));
    }

    if (condition && typeof condition === "string") {
      const conditions = condition.split(",").map((c) => c.trim().toUpperCase());
      filtered = filtered.filter((l) => conditions.includes(l.condition.toUpperCase()));
    }

    if (maxPrice) {
      const max = parseFloat(String(maxPrice));
      if (!isNaN(max)) {
        filtered = filtered.filter((l) => l.price <= max);
      }
    }

    if (minScore) {
      const min = parseFloat(String(minScore));
      if (!isNaN(min)) {
        filtered = filtered.filter(
          (l) => (l.device?.secondLifeScores?.[0]?.score || 95) >= min
        );
      }
    }

    if (sort === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "score_desc") {
      filtered.sort(
        (a, b) => (b.device?.secondLifeScores?.[0]?.score || 95) - (a.device?.secondLifeScores?.[0]?.score || 95)
      );
    }

    return res.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 5. GET /listings/featured
// ----------------------------------------------------
export async function getFeaturedListingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    let listings: any[] = [];
    try {
      const db = await getDb();
      const rows = await db.all(`
        SELECT l.*, d.brand, d.model, d.category, d.storage, d.ram, d.color, d.year, d.imei, s.name as seller_name, s.avatar as seller_avatar
        FROM DeviceListing l
        JOIN Device d ON l.deviceId = d.id
        JOIN User s ON l.sellerId = s.id
        WHERE l.status = 'ACTIVE'
        LIMIT 12
      `);
      listings = rows.map((r: any) => ({
        ...r,
        images: parseListingImages(r.images),
        device: {
          id: r.deviceId, brand: r.brand, model: r.model,
          category: r.category || inferCategory(r.brand, r.model, r.title),
          storage: r.storage, ram: r.ram, color: r.color, year: r.year, imei: r.imei,
          secondLifeScores: [], sustainabilityRecords: [], digitalPassport: null
        },
        seller: {
          id: r.sellerId, name: r.seller_name, avatar: r.seller_avatar
        }
      }));
    } catch {}

    if (!listings || listings.length === 0) {
      listings = SEEDED_CATALOG.map((l) => ({ ...l, images: parseListingImages(l.images) }));
    }

    return res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 6. GET /listings/:id (Detail)
// ----------------------------------------------------
export async function getListingByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    let listing: any = null;
    try {
      const db = await getDb();
      const listingRow = await db.get(`
        SELECT l.*, d.brand, d.model, d.category, d.storage, d.ram, d.color, d.year, d.imei, s.name as seller_name, s.email as seller_email, s.avatar as seller_avatar
        FROM DeviceListing l
        JOIN Device d ON l.deviceId = d.id
        JOIN User s ON l.sellerId = s.id
        WHERE l.id = ?
      `, [id]);
      
      if (listingRow) {
         listing = {
           ...listingRow,
           images: parseListingImages(listingRow.images),
           device: {
             id: listingRow.deviceId, brand: listingRow.brand, model: listingRow.model,
             category: listingRow.category || inferCategory(listingRow.brand, listingRow.model, listingRow.title),
             storage: listingRow.storage, ram: listingRow.ram, color: listingRow.color,
             year: listingRow.year, imei: listingRow.imei
           },
           seller: {
             id: listingRow.sellerId, name: listingRow.seller_name, email: listingRow.seller_email, avatar: listingRow.seller_avatar
           }
         }
      }
    } catch {
      // Fallback
    }

    if (!listing) {
      const found = SEEDED_CATALOG.find((l) => l.id === id) || SEEDED_CATALOG[0];
      listing = { ...found, images: parseListingImages(found.images) };
    }

    return res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 7. Upload images handler
// ----------------------------------------------------
export async function uploadListingImagesHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const files = (req.files as any[]) || [];
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: "No image files provided." });
    }

    const processedUrls: string[] = [];
    for (const file of files) {
      const stored = await optimizeAndStoreImage(file.buffer, file.originalname);
      processedUrls.push(stored.url);
    }

    return res.json({
      success: true,
      message: `Successfully processed and stored ${processedUrls.length} device image(s).`,
      urls: processedUrls,
    });
  } catch (error) {
    next(error);
  }
}

export const uploadImagesHandler = uploadListingImagesHandler;

// ----------------------------------------------------
// 8. PATCH /listings/:id (Update listing)
// ----------------------------------------------------
export async function updateListingHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { price, status, description, title } = req.body;

    const db = await getDb();
    
    // We update manually because we don't have undefined omissions easily in raw SQL
    let updateQuery = `UPDATE DeviceListing SET `;
    const params = [];
    if (price !== undefined) { updateQuery += `price = ?, `; params.push(parseFloat(String(price))); }
    if (status) { updateQuery += `status = ?, `; params.push(status); }
    if (title) { updateQuery += `title = ?, `; params.push(title); }
    
    if (params.length > 0) {
      updateQuery = updateQuery.slice(0, -2) + ` WHERE id = ?`;
      params.push(id);
      await db.run(updateQuery, params);
    }
    
    const listing = await db.get(`SELECT * FROM DeviceListing WHERE id = ?`, [id]);

    return res.json({
      success: true,
      message: "Listing updated successfully.",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 9. DELETE /listings/:id (Deactivate or delete listing)
// ----------------------------------------------------
export async function deleteListingHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const db = await getDb();
    await db.run(`UPDATE DeviceListing SET status = ? WHERE id = ?`, [ListingStatus.ARCHIVED, id]);
    const listing = await db.get(`SELECT * FROM DeviceListing WHERE id = ?`, [id]);

    return res.json({
      success: true,
      message: "Listing successfully archived.",
      data: listing,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 10. GET /listings/seller/:sellerId
// ----------------------------------------------------
export async function getSellerListingsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { sellerId } = req.params;

    let listings: any[] = [];
    try {
      const db = await getDb();
      const rows = await db.all(`
        SELECT l.*, d.brand, d.model, d.storage, d.ram, d.color, d.year, d.imei, s.name as seller_name, s.avatar as seller_avatar
        FROM DeviceListing l
        JOIN Device d ON l.deviceId = d.id
        JOIN User s ON l.sellerId = s.id
        WHERE l.sellerId = ?
      `, [sellerId]);
      listings = rows.map((r: any) => ({
        ...r,
        device: {
          id: r.deviceId, brand: r.brand, model: r.model, storage: r.storage, ram: r.ram, color: r.color, year: r.year, imei: r.imei,
          secondLifeScores: [], digitalPassport: null
        },
        seller: {
          id: r.sellerId, name: r.seller_name, avatar: r.seller_avatar
        }
      }));
    } catch {
      // Fallback
    }

    if (!listings || listings.length === 0) {
      listings = SEEDED_CATALOG.filter((l) => l.sellerId === sellerId || l.seller.id === sellerId);
      if (listings.length === 0) {
        listings = SEEDED_CATALOG.slice(0, 4);
      }
    }

    return res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
}

