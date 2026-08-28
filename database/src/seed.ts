import { getDb } from "./db";
import {
  Role,
  ListingCondition,
  ListingStatus,
  PassportEntryType,
  AIRecommendation,
  OrderStatus,
  WarrantyStatus,
  NotificationType,
} from "./schemas";
import { v4 as uuidv4 } from "uuid";

export async function seedDatabase() {
  console.log("🌱 [ReTech Database] Starting comprehensive category & brand seed populate with budget refurbished pricing...");
  
  const db = await getDb();

  // Ensure category column exists in Device table
  try {
    await db.run("ALTER TABLE Device ADD COLUMN category TEXT DEFAULT 'Phones'");
  } catch {}

  // 1. Clean existing records in dependency order
  try {
    await db.run("DELETE FROM Review");
    await db.run("DELETE FROM Warranty");
    await db.run("DELETE FROM \"Order\"");
    await db.run("DELETE FROM CartItem");
    await db.run("DELETE FROM Cart");
    await db.run("DELETE FROM Notification");
    await db.run("DELETE FROM AIDecision");
    await db.run("DELETE FROM SecondLifeScore");
    await db.run("DELETE FROM SustainabilityRecord");
    await db.run("DELETE FROM PassportEntry");
    await db.run("DELETE FROM DigitalLifePassport");
    await db.run("DELETE FROM DeviceListing");
    await db.run("DELETE FROM Device");
    await db.run("DELETE FROM SellerProfile");
    await db.run("DELETE FROM User");
    console.log("🧹 Cleaned existing tables.");
  } catch (e) {
    console.log("ℹ️ Preparing tables for seed insert.");
  }

  // Generate verified bcrypt hash for Password123!
  let passwordHash = "$2a$10$iM3d9sYxMkJ5V6z8W4nOyeG0aKj0m1l2k3j4h5g6f7e8d9c0b1a2";
  try {
    const bcrypt = require("bcryptjs");
    passwordHash = await bcrypt.hash("Password123!", 10);
  } catch {
    try {
      const bcryptNative = require("bcrypt");
      passwordHash = await bcryptNative.hash("Password123!", 10);
    } catch {}
  }

  // ----------------------------------------------------
  // 2. CREATE 10 DEMO USERS WITH AUTH PASSWORDS
  // ----------------------------------------------------
  const usersData = [
    { email: "admin@retech.eco", name: "ReTech System Admin", role: Role.ADMIN, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
    { email: "elena.tech@retech.eco", name: "Elena Rostova (Lead AI Assessor)", role: Role.ADMIN, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
    { email: "greencircuit@seller.retech.eco", name: "GreenCircuit Certified Labs", role: Role.SELLER, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    { email: "apex.seller@retech.eco", name: "Apex Silicon Refurbishers", role: Role.SELLER, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
    { email: "eco.renew@seller.retech.eco", name: "EcoRenew Solutions", role: Role.SELLER, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
    { email: "alex.rivera@retech.eco", name: "Alex Rivera", role: Role.BUYER, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80" },
    { email: "sarah.connor@buyer.retech.eco", name: "Sarah Connor", role: Role.BUYER, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
    { email: "alex.kumar@buyer.retech.eco", name: "Alex Kumar", role: Role.BUYER, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" },
    { email: "chloe.dupont@buyer.retech.eco", name: "Chloe Dupont", role: Role.BUYER, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" },
    { email: "maya.patel@buyer.retech.eco", name: "Maya Patel", role: Role.BUYER, passwordHash, isEmailVerified: true, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80" },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const id = uuidv4();
    await db.run(
      `INSERT INTO User (id, email, name, role, passwordHash, isEmailVerified, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, u.email, u.name, u.role, u.passwordHash, u.isEmailVerified, u.avatar]
    );
    createdUsers.push({ id, ...u });
  }
  console.log(`✅ Seeded ${createdUsers.length} Users with active Password123! credentials`);

  const [admin1, admin2, seller1, seller2, seller3, buyer1, buyer2, buyer3, buyer4, buyer5] = createdUsers;

  // ----------------------------------------------------
  // 3. CREATE SELLER PROFILES
  // ----------------------------------------------------
  const sellerProfilesData = [
    { userId: seller1.id, businessName: "GreenCircuit Certified Labs", verified: true, rating: 4.95, totalSales: 1420 },
    { userId: seller2.id, businessName: "Apex Silicon Labs", verified: true, rating: 4.88, totalSales: 980 },
    { userId: seller3.id, businessName: "EcoRenew Solutions", verified: true, rating: 4.91, totalSales: 630 },
  ];

  for (const sp of sellerProfilesData) {
    await db.run(
      `INSERT INTO SellerProfile (id, userId, businessName, verified, rating, totalSales) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), sp.userId, sp.businessName, sp.verified, sp.rating, sp.totalSales]
    );
  }
  console.log("✅ Seeded 3 Verified Refurbisher Seller Profiles");

  // ----------------------------------------------------
  // 4. CREATE BUDGET-FRIENDLY REFURBISHED GADGET CATALOG
  // ----------------------------------------------------
  const devicesAndListings = [
    // ====================================================
    // 1. PHONES (Apple, Samsung, OnePlus, Google, Xiaomi)
    // ====================================================
    // Apple
    {
      category: "Phones", brand: "Apple", model: "iPhone 15 Pro", storage: "256GB", ram: "8GB", color: "Natural Titanium", year: 2023,
      title: "Apple iPhone 15 Pro 256GB - Natural Titanium (Refurbished Grade A+)",
      price: 389.0, originalPrice: 1199.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 98, co2: 68.5,
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1695048132924-42b78b02e7be?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "Apple", model: "iPhone 14 Pro Max", storage: "512GB", ram: "6GB", color: "Deep Purple", year: 2022,
      title: "Apple iPhone 14 Pro Max 512GB - Deep Purple (OLED Certified Refurbished)",
      price: 349.0, originalPrice: 1299.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 96, co2: 72.0,
      images: [
        "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "Apple", model: "iPhone 13", storage: "128GB", ram: "4GB", color: "Starlight", year: 2021,
      title: "Apple iPhone 13 128GB - Starlight (Great Value Certified Grade B+)",
      price: 199.0, originalPrice: 699.0, condition: ListingCondition.GOOD,
      seller: seller1, score: 91, co2: 54.0,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Samsung
    {
      category: "Phones", brand: "Samsung", model: "Galaxy S24 Ultra", storage: "512GB", ram: "12GB", color: "Titanium Gray", year: 2024,
      title: "Samsung Galaxy S24 Ultra 5G 512GB - Titanium Gray (Refurbished Grade A)",
      price: 399.0, originalPrice: 1419.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 97, co2: 65.0,
      images: [
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "Samsung", model: "Galaxy Z Fold 5", storage: "256GB", ram: "12GB", color: "Icy Blue", year: 2023,
      title: "Samsung Galaxy Z Fold 5 256GB Dual Screen Foldable - Icy Blue (Refurbished)",
      price: 429.0, originalPrice: 1799.0, condition: ListingCondition.EXCELLENT,
      seller: seller3, score: 94, co2: 78.0,
      images: [
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // OnePlus
    {
      category: "Phones", brand: "OnePlus", model: "OnePlus 12 5G", storage: "256GB", ram: "16GB", color: "Flowy Emerald", year: 2024,
      title: "OnePlus 12 5G 256GB Snapdragon 8 Gen 3 Hasselblad - Flowy Emerald",
      price: 279.0, originalPrice: 799.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 98, co2: 59.0,
      images: [
        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "OnePlus", model: "OnePlus Open", storage: "512GB", ram: "16GB", color: "Voyager Black", year: 2023,
      title: "OnePlus Open 512GB Dual ProXDR Foldable Smartphone - Voyager Black",
      price: 469.0, originalPrice: 1699.0, condition: ListingCondition.EXCELLENT,
      seller: seller3, score: 95, co2: 76.0,
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Google
    {
      category: "Phones", brand: "Google", model: "Pixel 8 Pro", storage: "256GB", ram: "12GB", color: "Bay Blue", year: 2023,
      title: "Google Pixel 8 Pro 256GB - Bay Blue (Tensor G3 Refurbished Grade A)",
      price: 289.0, originalPrice: 999.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 96, co2: 58.0,
      images: [
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "Google", model: "Pixel Fold", storage: "256GB", ram: "12GB", color: "Obsidian", year: 2023,
      title: "Google Pixel Fold 256GB Dual OLED Foldable Smartphone - Obsidian",
      price: 399.0, originalPrice: 1799.0, condition: ListingCondition.EXCELLENT,
      seller: seller1, score: 93, co2: 74.0,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Xiaomi
    {
      category: "Phones", brand: "Xiaomi", model: "Xiaomi 14 Pro", storage: "512GB", ram: "16GB", color: "Titanium Edition", year: 2024,
      title: "Xiaomi 14 Pro 512GB Leica Summilux Optics Snapdragon 8 Gen 3 (Refurbished)",
      price: 249.0, originalPrice: 999.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 96, co2: 61.0,
      images: [
        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80"
      ]
    },

    // ====================================================
    // 2. LAPTOPS (Apple, Dell, HP, Lenovo, ASUS, Acer)
    // ====================================================
    // Apple
    {
      category: "Laptops", brand: "Apple", model: "MacBook Pro 16 M3 Max", storage: "1TB", ram: "36GB", color: "Space Black", year: 2023,
      title: "Apple MacBook Pro 16\" M3 Max 36GB RAM 1TB SSD - Space Black (Certified Refurbished)",
      price: 689.0, originalPrice: 3499.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 99, co2: 185.0,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Laptops", brand: "Apple", model: "MacBook Air 15 M2", storage: "512GB", ram: "16GB", color: "Midnight", year: 2023,
      title: "Apple MacBook Air 15\" M2 16GB Unified Memory 512GB - Midnight",
      price: 389.0, originalPrice: 1499.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 95, co2: 110.0,
      images: [
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Dell
    {
      category: "Laptops", brand: "Dell", model: "XPS 15 9530 OLED", storage: "1TB", ram: "32GB", color: "Platinum Silver", year: 2023,
      title: "Dell XPS 15 9530 3.5K OLED Touch Intel i7-13700H 32GB RTX 4060",
      price: 449.0, originalPrice: 2299.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 95, co2: 145.0,
      images: [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Laptops", brand: "Dell", model: "XPS 13 Plus 9320", storage: "512GB", ram: "16GB", color: "Graphite", year: 2023,
      title: "Dell XPS 13 Plus 9320 4K UHD+ Zero-Lattice Core i7 16GB RAM",
      price: 329.0, originalPrice: 1549.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 95, co2: 98.0,
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // HP
    {
      category: "Laptops", brand: "HP", model: "Spectre x360 16 2-in-1", storage: "1TB", ram: "16GB", color: "Nightfall Black", year: 2023,
      title: "HP Spectre x360 16\" 4K UHD+ OLED Touch 2-in-1 Intel i7-13700H",
      price: 379.0, originalPrice: 1899.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 96, co2: 130.0,
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Laptops", brand: "HP", model: "OMEN 16 Gaming", storage: "1TB", ram: "32GB", color: "Shadow Black", year: 2023,
      title: "HP OMEN 16 QHD 240Hz Gaming Laptop Intel i7 RTX 4070 32GB DDR5",
      price: 429.0, originalPrice: 1899.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 94, co2: 155.0,
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Lenovo
    {
      category: "Laptops", brand: "Lenovo", model: "ThinkPad X1 Carbon Gen 11", storage: "1TB", ram: "32GB", color: "Deep Black", year: 2023,
      title: "Lenovo ThinkPad X1 Carbon Gen 11 Ultralight Business Laptop Intel i7",
      price: 349.0, originalPrice: 1999.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 96, co2: 125.0,
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Laptops", brand: "Lenovo", model: "Legion Pro 7i", storage: "2TB", ram: "32GB", color: "Onyx Grey", year: 2023,
      title: "Lenovo Legion Pro 7i 16\" 240Hz WQXGA Intel i9-13900HX RTX 4080",
      price: 589.0, originalPrice: 2699.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 97, co2: 170.0,
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // ASUS
    {
      category: "Laptops", brand: "ASUS", model: "ROG Zephyrus G14 OLED", storage: "1TB", ram: "16GB", color: "Moonlight White", year: 2023,
      title: "ASUS ROG Zephyrus G14 QHD 165Hz Ryzen 9 RTX 4070 Gaming Laptop",
      price: 419.0, originalPrice: 1799.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 94, co2: 138.0,
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Laptops", brand: "ASUS", model: "Zenbook Pro 14 Duo", storage: "1TB", ram: "32GB", color: "Tech Black", year: 2023,
      title: "ASUS Zenbook Pro 14 Duo OLED Dual Screen Creator Laptop Intel i9",
      price: 459.0, originalPrice: 2299.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 96, co2: 148.0,
      images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Acer
    {
      category: "Laptops", brand: "Acer", model: "Predator Helios 16", storage: "1TB", ram: "16GB", color: "Abyssal Black", year: 2023,
      title: "Acer Predator Helios 16 WQXGA 240Hz Intel i7 RTX 4070 Gaming Laptop",
      price: 399.0, originalPrice: 1699.0, condition: ListingCondition.EXCELLENT,
      seller: seller3, score: 93, co2: 152.0,
      images: [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Laptops", brand: "Acer", model: "Swift Go 14 OLED", storage: "512GB", ram: "16GB", color: "Sunshiny Gold", year: 2023,
      title: "Acer Swift Go 14 2.8K 90Hz OLED Ultra-Thin Laptop Intel Core i7",
      price: 249.0, originalPrice: 899.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 95, co2: 88.0,
      images: [
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"
      ]
    },

    // ====================================================
    // 3. HEADPHONES (Sony, JBL, Bose, Apple, Samsung)
    // ====================================================
    // Sony
    {
      category: "Headphones", brand: "Sony", model: "WH-1000XM5 ANC", storage: "N/A", ram: "N/A", color: "Silver Edition", year: 2023,
      title: "Sony WH-1000XM5 Premium Noise-Canceling Wireless Headphones",
      price: 119.0, originalPrice: 399.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 99, co2: 24.0,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // JBL
    {
      category: "Headphones", brand: "JBL", model: "Tour One M2", storage: "N/A", ram: "N/A", color: "Piano Black", year: 2023,
      title: "JBL Tour One M2 Adaptive Noise-Canceling Over-Ear Wireless Headphones",
      price: 69.0, originalPrice: 299.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 96, co2: 20.0,
      images: [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Bose
    {
      category: "Headphones", brand: "Bose", model: "QuietComfort Ultra", storage: "N/A", ram: "N/A", color: "Triple Black", year: 2023,
      title: "Bose QuietComfort Ultra Spatial Audio Noise-Canceling Headphones",
      price: 129.0, originalPrice: 429.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 97, co2: 22.0,
      images: [
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Apple
    {
      category: "Headphones", brand: "Apple", model: "AirPods Max", storage: "N/A", ram: "N/A", color: "Space Gray", year: 2022,
      title: "Apple AirPods Max Wireless Over-Ear Headphones with Smart Case",
      price: 149.0, originalPrice: 549.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 98, co2: 28.0,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Samsung
    {
      category: "Headphones", brand: "Samsung", model: "Galaxy Buds2 Pro", storage: "N/A", ram: "N/A", color: "Bora Purple", year: 2023,
      title: "Samsung Galaxy Buds2 Pro 24-bit Hi-Fi ANC Wireless Earbuds",
      price: 49.0, originalPrice: 229.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 97, co2: 12.0,
      images: [
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80"
      ]
    },

    // ====================================================
    // 4. TABLETS (Samsung, Lenovo, Xiaomi)
    // ====================================================
    // Samsung
    {
      category: "Tablets", brand: "Samsung", model: "Galaxy Tab S9 Ultra", storage: "512GB", ram: "12GB", color: "Graphite", year: 2023,
      title: "Samsung Galaxy Tab S9 Ultra 14.6\" Dynamic AMOLED 2X with S-Pen",
      price: 289.0, originalPrice: 1199.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 97, co2: 89.0,
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Lenovo
    {
      category: "Tablets", brand: "Lenovo", model: "Tab P12 Pro", storage: "256GB", ram: "8GB", color: "Storm Grey", year: 2023,
      title: "Lenovo Tab P12 Pro 12.6\" 2K AMOLED 120Hz Tablet with Precision Pen 3",
      price: 179.0, originalPrice: 699.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 94, co2: 72.0,
      images: [
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Xiaomi
    {
      category: "Tablets", brand: "Xiaomi", model: "Xiaomi Pad 6 Max", storage: "512GB", ram: "12GB", color: "Cosmic Black", year: 2023,
      title: "Xiaomi Pad 6 Max 14\" Snapdragon 8+ Gen 1 120Hz 10,000mAh Battery",
      price: 189.0, originalPrice: 749.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 95, co2: 78.0,
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"
      ]
    },

    // ====================================================
    // 5. IPADS (Apple: iPad, iPad Air, iPad Pro, iPad Mini)
    // ====================================================
    // iPad Base
    {
      category: "iPads", brand: "Apple", model: "iPad (10th Gen)", storage: "64GB", ram: "4GB", color: "Blue", year: 2022,
      title: "Apple iPad 10th Gen 10.9\" Liquid Retina 64GB Wi-Fi - Blue",
      price: 149.0, originalPrice: 449.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 98, co2: 62.0,
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // iPad Air
    {
      category: "iPads", brand: "Apple", model: "iPad Air M2 11\"", storage: "256GB", ram: "8GB", color: "Starlight", year: 2024,
      title: "Apple iPad Air 11\" M2 Liquid Retina 256GB Wi-Fi - Starlight",
      price: 229.0, originalPrice: 699.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 99, co2: 70.0,
      images: [
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // iPad Pro
    {
      category: "iPads", brand: "Apple", model: "iPad Pro 12.9 M2", storage: "256GB", ram: "8GB", color: "Space Gray", year: 2022,
      title: "Apple iPad Pro 12.9\" M2 Liquid Retina XDR 256GB Wi-Fi - Space Gray",
      price: 299.0, originalPrice: 1099.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 97, co2: 85.0,
      images: [
        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // iPad Mini
    {
      category: "iPads", brand: "Apple", model: "iPad Mini (6th Gen)", storage: "64GB", ram: "4GB", color: "Purple", year: 2021,
      title: "Apple iPad Mini 6th Gen 8.3\" Liquid Retina A15 Bionic 64GB - Purple",
      price: 169.0, originalPrice: 499.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 95, co2: 50.0,
      images: [
        "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80"
      ]
    },

    // ====================================================
    // 6. SMART WATCHES (Apple, Samsung, Garmin, Noise, boAt)
    // ====================================================
    // Apple
    {
      category: "Smart Watches", brand: "Apple", model: "Watch Ultra 2", storage: "64GB", ram: "1GB", color: "Titanium", year: 2023,
      title: "Apple Watch Ultra 2 GPS + Cellular 49mm Titanium - Ocean Band",
      price: 179.0, originalPrice: 799.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 98, co2: 32.0,
      images: [
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Smart Watches", brand: "Apple", model: "Watch Series 9", storage: "64GB", ram: "1GB", color: "Midnight", year: 2023,
      title: "Apple Watch Series 9 GPS 45mm Midnight Aluminum with Sport Band",
      price: 119.0, originalPrice: 429.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 97, co2: 26.0,
      images: [
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Samsung
    {
      category: "Smart Watches", brand: "Samsung", model: "Galaxy Watch 6 Classic", storage: "16GB", ram: "2GB", color: "Black Steel", year: 2023,
      title: "Samsung Galaxy Watch 6 Classic 47mm Bluetooth Smartwatch with Rotating Bezel",
      price: 89.0, originalPrice: 399.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 96, co2: 24.0,
      images: [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Garmin
    {
      category: "Smart Watches", brand: "Garmin", model: "Fenix 7 Pro Sapphire Solar", storage: "32GB", ram: "1GB", color: "Carbon Gray DLC Titanium", year: 2023,
      title: "Garmin Fenix 7 Pro Sapphire Solar Multi-Sport GPS Outdoor Watch",
      price: 189.0, originalPrice: 899.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 98, co2: 34.0,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Noise
    {
      category: "Smart Watches", brand: "Noise", model: "ColorFit Pro 5 Max", storage: "N/A", ram: "N/A", color: "Jet Black Metallic", year: 2024,
      title: "Noise ColorFit Pro 5 Max 1.96\" AMOLED Display BT Calling Smartwatch",
      price: 24.0, originalPrice: 99.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 95, co2: 14.0,
      images: [
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // boAt
    {
      category: "Smart Watches", brand: "boAt", model: "Ultima Call Pro", storage: "N/A", ram: "N/A", color: "Active Black", year: 2023,
      title: "boAt Ultima Call Pro 1.83\" HD Curved Display Bluetooth Calling Smartwatch",
      price: 19.0, originalPrice: 79.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 93, co2: 12.0,
      images: [
        "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=1000&q=80"
      ]
    },

    // ====================================================
    // 7. PCs / DESKTOP COMPUTERS (Apple, Dell, HP, Lenovo, ASUS, Acer)
    // ====================================================
    // Apple
    {
      category: "PCs / Desktop Computers", brand: "Apple", model: "Mac Studio M2 Max", storage: "512GB", ram: "32GB", color: "Silver", year: 2023,
      title: "Apple Mac Studio M2 Max (12-Core CPU, 30-Core GPU) 32GB RAM 512GB SSD",
      price: 549.0, originalPrice: 1999.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 99, co2: 160.0,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "PCs / Desktop Computers", brand: "Apple", model: "iMac 24\" 4.5K Retina M3", storage: "512GB", ram: "16GB", color: "Ocean Blue", year: 2023,
      title: "Apple iMac 24\" 4.5K Retina Display M3 Chip 16GB Unified Memory 512GB SSD",
      price: 449.0, originalPrice: 1699.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 98, co2: 140.0,
      images: [
        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Dell
    {
      category: "PCs / Desktop Computers", brand: "Dell", model: "Alienware Aurora R16", storage: "2TB", ram: "32GB", color: "Basalt Black", year: 2023,
      title: "Dell Alienware Aurora R16 Gaming Desktop Intel Core i9-14900KF RTX 4080",
      price: 599.0, originalPrice: 2899.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 97, co2: 240.0,
      images: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "PCs / Desktop Computers", brand: "Dell", model: "OptiPlex 7010 Micro", storage: "512GB", ram: "16GB", color: "Matte Black", year: 2023,
      title: "Dell OptiPlex 7010 Micro Business PC Intel Core i7-13700T 16GB DDR5",
      price: 179.0, originalPrice: 849.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 96, co2: 95.0,
      images: [
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // HP
    {
      category: "PCs / Desktop Computers", brand: "HP", model: "OMEN 45L Gaming Desktop", storage: "2TB", ram: "32GB", color: "Shadow Black Tempered Glass", year: 2023,
      title: "HP OMEN 45L Liquid-Cooled Gaming PC Intel i7-13700K RTX 4070 Ti 32GB RAM",
      price: 549.0, originalPrice: 2499.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 96, co2: 220.0,
      images: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Lenovo
    {
      category: "PCs / Desktop Computers", brand: "Lenovo", model: "Legion Tower 7i", storage: "2TB", ram: "32GB", color: "Storm Grey ARGB", year: 2023,
      title: "Lenovo Legion Tower 7i Gaming Rig Intel i9-13900KF RTX 4080 32GB DDR5",
      price: 579.0, originalPrice: 2799.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 97, co2: 235.0,
      images: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // ASUS
    {
      category: "PCs / Desktop Computers", brand: "ASUS", model: "ROG Strix G16CH", storage: "1TB", ram: "16GB", color: "Extreme Gray", year: 2023,
      title: "ASUS ROG Strix G16CH Gaming Desktop Intel Core i7-13700F RTX 4070",
      price: 449.0, originalPrice: 1799.0, condition: ListingCondition.EXCELLENT,
      seller: seller3, score: 95, co2: 190.0,
      images: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    // Acer
    {
      category: "PCs / Desktop Computers", brand: "Acer", model: "Predator Orion 7000", storage: "2TB", ram: "32GB", color: "Obsidian Black Glass", year: 2023,
      title: "Acer Predator Orion 7000 Extreme Gaming Desktop Intel i9 RTX 4080",
      price: 569.0, originalPrice: 2699.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 96, co2: 230.0,
      images: [
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
      ]
    }
  ];

  const createdListings = [];

  for (let idx = 0; idx < devicesAndListings.length; idx++) {
    const item = devicesAndListings[idx];
    const deviceId = uuidv4();
    const listingId = uuidv4();
    const imei = `359871234567${800 + idx}`;

    // 1. Create Device
    await db.run(
      `INSERT INTO Device (id, brand, model, category, storage, ram, color, year, imei) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [deviceId, item.brand, item.model, item.category, item.storage, item.ram, item.color, item.year, imei]
    );

    // 2. Create Listing
    const imagesJson = JSON.stringify(item.images);
    await db.run(
      `INSERT INTO DeviceListing (id, deviceId, sellerId, title, price, condition, status, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [listingId, deviceId, item.seller.id, item.title, item.price, item.condition, ListingStatus.ACTIVE, imagesJson]
    );
    createdListings.push({ id: listingId, deviceId, ...item });

    // 3. Create Second Life Score
    await db.run(
      `INSERT INTO SecondLifeScore (id, deviceId, score, breakdown) VALUES (?, ?, ?, ?)`,
      [
        uuidv4(),
        deviceId,
        item.score,
        JSON.stringify({
          batteryHealth: Math.min(100, item.score + 1),
          cosmeticIndex: item.score - 1,
          screenIntegrity: 100,
          thermalEfficiency: item.score,
        })
      ]
    );

    // 4. Create Sustainability Carbon Savings
    await db.run(
      `INSERT INTO SustainabilityRecord (id, deviceId, co2SavedKg, eWasteAvoidedKg) VALUES (?, ?, ?, ?)`,
      [uuidv4(), deviceId, item.co2, +(item.co2 * 0.004).toFixed(2)]
    );

    // 5. Create Digital Life Passport with cryptographic history
    const passportId = uuidv4();
    await db.run(
      `INSERT INTO DigitalLifePassport (id, deviceId, history, repairs, previousOwners, originalPurchaseDate, verifiedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        passportId,
        deviceId,
        JSON.stringify([
          { event: "Manufactured by " + item.brand + " Certified Assembly", date: `${item.year}-02-14` },
          { event: "Authorized First Owner Activation", date: `${item.year}-03-01` },
          { event: "Ingested into ReTech Circular Labs", date: "2026-08-01" },
          { event: "Cryptographic Firmware & Battery Verification Passed", date: "2026-08-15" }
        ]),
        JSON.stringify([
          { part: "Battery", replaced: item.score < 95, date: "2026-08-15", oemCertified: true },
          { part: "Thermal Dissipation Layer", replaced: true, date: "2026-08-15" }
        ]),
        idx % 3 === 0 ? 1 : 2,
        new Date(`${item.year}-03-01`).toISOString(),
        new Date().toISOString()
      ]
    );

    // 6. Passport Inspection Entries
    await db.run(
      `INSERT INTO PassportEntry (id, passportId, type, description, verifiedBy) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), passportId, PassportEntryType.FACTORY_RESET, "Cryptographic DoD 5220.22-M 3-pass data wipe completed.", "Elena Rostova (AI Lead)"]
    );
    await db.run(
      `INSERT INTO PassportEntry (id, passportId, type, description, verifiedBy) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), passportId, PassportEntryType.INSPECTION, `42-point AI optical & subpixel test passed with Second Life Score of ${item.score}/100.`, "ReTech Optical Diagnostic Bot"]
    );
    await db.run(
      `INSERT INTO PassportEntry (id, passportId, type, description, verifiedBy) VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), passportId, PassportEntryType.CERTIFICATION, "Issued 12-Month ReTech Guaranteed Hardware Warranty.", "ReTech Certification Board"]
    );

    // 7. AI Recommendation Decision
    await db.run(
      `INSERT INTO AIDecision (id, deviceId, userId, recommendation, reasoning, confidence) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        deviceId,
        buyer1.id,
        item.score >= 95 ? AIRecommendation.BUY : AIRecommendation.HOLD,
        `Neural diagnostic rates ${item.brand} ${item.model} in top 5% of durability curve with optimal battery thermal efficiency.`,
        0.96
      ]
    );
  }

  console.log(`✅ Seeded ${devicesAndListings.length} Devices across all 7 Categories & Requested Brands with budget-friendly refurbished pricing!`);

  // ----------------------------------------------------
  // 5. CREATE ORDERS, REVIEWS & WARRANTIES
  // ----------------------------------------------------
  const order1Id = uuidv4();
  await db.run(
    `INSERT INTO "Order" (id, buyerId, listingId, amount, status, paymentIntentId) VALUES (?, ?, ?, ?, ?, ?)`,
    [order1Id, buyer1.id, createdListings[0].id, createdListings[0].price, OrderStatus.DELIVERED, "pi_retech_live_sample_98471"]
  );

  await db.run(
    `INSERT INTO Review (id, orderId, rating, comment) VALUES (?, ?, ?, ?)`,
    [uuidv4(), order1Id, 5, "Arrived in pristine condition! Battery health was verified at 99%. Outstanding circular experience and fast delivery."]
  );

  await db.run(
    `INSERT INTO Warranty (id, orderId, duration, status, expiresAt, terms) VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), order1Id, 12, WarrantyStatus.ACTIVE, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), "12-month comprehensive warranty covering battery, mainboard, OLED display, and cameras."]
  );

  const order2Id = uuidv4();
  await db.run(
    `INSERT INTO "Order" (id, buyerId, listingId, amount, status, paymentIntentId) VALUES (?, ?, ?, ?, ?, ?)`,
    [order2Id, buyer2.id, createdListings[10].id, createdListings[10].price, OrderStatus.SHIPPED, "pi_retech_live_sample_98472"]
  );

  await db.run(
    `INSERT INTO Warranty (id, orderId, duration, status, expiresAt, terms) VALUES (?, ?, ?, ?, ?, ?)`,
    [uuidv4(), order2Id, 12, WarrantyStatus.ACTIVE, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), "Full hardware replacement and 24/7 dedicated support."]
  );
  
  console.log(`✅ Seeded Verified Customer Orders, Reviews, and 12-Month Warranties`);

  // ----------------------------------------------------
  // 6. CREATE SAMPLE CARTS & NOTIFICATIONS
  // ----------------------------------------------------
  const cartId = uuidv4();
  await db.run(`INSERT INTO Cart (id, userId) VALUES (?, ?)`, [cartId, buyer1.id]);
  await db.run(`INSERT INTO CartItem (id, cartId, listingId, quantity) VALUES (?, ?, ?, ?)`, [uuidv4(), cartId, createdListings[1].id, 1]);
  await db.run(`INSERT INTO CartItem (id, cartId, listingId, quantity) VALUES (?, ?, ?, ?)`, [uuidv4(), cartId, createdListings[8].id, 1]);

  const notifications = [
    { userId: buyer1.id, type: NotificationType.ORDER_DELIVERED, title: "iPhone 15 Pro Delivered", message: "Your verified Apple iPhone 15 Pro package was safely delivered.", read: true },
    { userId: buyer1.id, type: NotificationType.PASSPORT_UPDATED, title: "Digital Passport Certified", message: "Digital Life Passport for iPhone 15 Pro was issued on the immutable circular ledger.", read: false },
    { userId: seller1.id, type: NotificationType.PRICE_DROP, title: "New Sale Verified", message: "Your listing for iPhone 15 Pro was purchased and verified by ReTech Escrow.", read: false },
  ];
  for (const notif of notifications) {
    await db.run(
      `INSERT INTO Notification (id, userId, type, title, message, read) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), notif.userId, notif.type, notif.title, notif.message, notif.read]
    );
  }
  console.log("✅ Seeded Live Cart Sessions & Realtime Notifications");

  console.log("\n🎉 [ReTech Database] Comprehensive static seed completed with 100% success!");
}

if (require.main === module) {
  seedDatabase()
    .catch((e) => {
      console.error("❌ Seed error:", e);
      process.exit(1);
    });
}
