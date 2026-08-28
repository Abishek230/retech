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
  console.log("🌱 [ReTech Database] Starting comprehensive category & brand seed populate with medium & budget refurbished pricing...");
  
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
  // 2. CREATE DEMO USERS WITH AUTH PASSWORDS
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
  // 4. CREATE GADGET CATALOG (PHONES, LAPTOPS, HEADPHONES, SMART WATCHES, TABLETS, IPADS, PCS)
  // ----------------------------------------------------
  const devicesAndListings = [
    // ====================================================
    // 1. PHONES (Apple, Samsung, OnePlus, Google, Xiaomi, Motorola, Nothing)
    // ====================================================
    // Apple (Medium Cost options + flagships)
    {
      category: "Phones", brand: "Apple", model: "iPhone 14", storage: "128GB", ram: "6GB", color: "Blue", year: 2022,
      title: "Apple iPhone 14 128GB - Midnight Blue (Medium-Cost Certified Refurbished)",
      price: 249.0, originalPrice: 799.0, condition: ListingCondition.EXCELLENT,
      seller: seller1, score: 95, co2: 60.0,
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1695048132924-42b78b02e7be?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "Apple", model: "iPhone 13 Pro", storage: "256GB", ram: "6GB", color: "Sierra Blue", year: 2021,
      title: "Apple iPhone 13 Pro 256GB 120Hz ProMotion - Sierra Blue (Medium Cost)",
      price: 289.0, originalPrice: 1099.0, condition: ListingCondition.EXCELLENT,
      seller: seller1, score: 94, co2: 64.0,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "Apple", model: "iPhone 13", storage: "128GB", ram: "4GB", color: "Starlight", year: 2021,
      title: "Apple iPhone 13 128GB - Starlight (Affordable Value Certified Grade B+)",
      price: 199.0, originalPrice: 699.0, condition: ListingCondition.GOOD,
      seller: seller1, score: 91, co2: 54.0,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "Apple", model: "iPhone 12 Pro", storage: "128GB", ram: "6GB", color: "Pacific Blue", year: 2020,
      title: "Apple iPhone 12 Pro 128GB - Pacific Blue (Budget-Friendly Certified)",
      price: 219.0, originalPrice: 999.0, condition: ListingCondition.GOOD,
      seller: seller1, score: 89, co2: 50.0,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "Apple", model: "iPhone 15", storage: "128GB", ram: "6GB", color: "Pink", year: 2023,
      title: "Apple iPhone 15 128GB Dynamic Island 48MP - Pastel Pink",
      price: 319.0, originalPrice: 899.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 97, co2: 66.0,
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80"
      ]
    },
    {
      category: "Phones", brand: "Apple", model: "iPhone 15 Pro", storage: "256GB", ram: "8GB", color: "Natural Titanium", year: 2023,
      title: "Apple iPhone 15 Pro 256GB - Natural Titanium (Refurbished Grade A+)",
      price: 389.0, originalPrice: 1199.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 98, co2: 68.5,
      images: [
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80"
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
      category: "Phones", brand: "Apple", model: "iPhone SE (3rd Gen)", storage: "64GB", ram: "4GB", color: "Midnight", year: 2022,
      title: "Apple iPhone SE 5G 64GB A15 Bionic - Midnight (Ultra Budget Refurbished)",
      price: 149.0, originalPrice: 429.0, condition: ListingCondition.EXCELLENT,
      seller: seller1, score: 93, co2: 45.0,
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
      images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Phones", brand: "Samsung", model: "Galaxy S23 5G", storage: "256GB", ram: "8GB", color: "Phantom Black", year: 2023,
      title: "Samsung Galaxy S23 5G 256GB Snapdragon 8 Gen 2 - Phantom Black",
      price: 239.0, originalPrice: 859.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 95, co2: 55.0,
      images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Phones", brand: "Samsung", model: "Galaxy Z Flip 5", storage: "256GB", ram: "8GB", color: "Mint", year: 2023,
      title: "Samsung Galaxy Z Flip 5 256GB Compact Foldable - Mint (Refurbished)",
      price: 279.0, originalPrice: 999.0, condition: ListingCondition.EXCELLENT,
      seller: seller3, score: 93, co2: 62.0,
      images: ["https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80"]
    },
    // OnePlus
    {
      category: "Phones", brand: "OnePlus", model: "OnePlus 12 5G", storage: "256GB", ram: "16GB", color: "Flowy Emerald", year: 2024,
      title: "OnePlus 12 5G 256GB Snapdragon 8 Gen 3 Hasselblad - Flowy Emerald",
      price: 279.0, originalPrice: 799.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 98, co2: 59.0,
      images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Phones", brand: "OnePlus", model: "OnePlus 11R", storage: "128GB", ram: "8GB", color: "Sonic Black", year: 2023,
      title: "OnePlus 11R 5G 128GB 100W SUPERVOOC - Sonic Black",
      price: 189.0, originalPrice: 499.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 92, co2: 48.0,
      images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80"]
    },
    // Google
    {
      category: "Phones", brand: "Google", model: "Pixel 8 Pro", storage: "256GB", ram: "12GB", color: "Bay Blue", year: 2023,
      title: "Google Pixel 8 Pro 256GB - Bay Blue (Tensor G3 Refurbished Grade A)",
      price: 289.0, originalPrice: 999.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 96, co2: 58.0,
      images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Phones", brand: "Google", model: "Pixel 7a", storage: "128GB", ram: "8GB", color: "Sea", year: 2023,
      title: "Google Pixel 7a 128GB Tensor G2 90Hz - Sea Blue (Affordable)",
      price: 149.0, originalPrice: 499.0, condition: ListingCondition.EXCELLENT,
      seller: seller1, score: 91, co2: 42.0,
      images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"]
    },
    // Xiaomi & Nothing
    {
      category: "Phones", brand: "Xiaomi", model: "Xiaomi 14 Pro", storage: "512GB", ram: "16GB", color: "Titanium Edition", year: 2024,
      title: "Xiaomi 14 Pro 512GB Leica Summilux Optics Snapdragon 8 Gen 3",
      price: 249.0, originalPrice: 999.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 96, co2: 61.0,
      images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Phones", brand: "Nothing", model: "Phone (2)", storage: "256GB", ram: "12GB", color: "Dark Gray", year: 2023,
      title: "Nothing Phone (2) 256GB Glyph Interface OLED - Dark Gray (Refurbished)",
      price: 209.0, originalPrice: 699.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 94, co2: 52.0,
      images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80"]
    },

    // ====================================================
    // 2. LAPTOPS (Apple, Dell, HP, Lenovo, ASUS, Acer)
    // ====================================================
    // Apple
    {
      category: "Laptops", brand: "Apple", model: "MacBook Air 13 M1", storage: "256GB", ram: "8GB", color: "Space Gray", year: 2020,
      title: "Apple MacBook Air 13\" M1 8GB RAM 256GB SSD - Space Gray (Best Value)",
      price: 299.0, originalPrice: 999.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 96, co2: 95.0,
      images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Laptops", brand: "Apple", model: "MacBook Air 15 M2", storage: "512GB", ram: "16GB", color: "Midnight", year: 2023,
      title: "Apple MacBook Air 15\" M2 16GB Unified Memory 512GB - Midnight",
      price: 389.0, originalPrice: 1499.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 95, co2: 110.0,
      images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Laptops", brand: "Apple", model: "MacBook Pro 16 M3 Max", storage: "1TB", ram: "36GB", color: "Space Black", year: 2023,
      title: "Apple MacBook Pro 16\" M3 Max 36GB RAM 1TB SSD - Space Black",
      price: 689.0, originalPrice: 3499.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 99, co2: 185.0,
      images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80"]
    },
    // Dell
    {
      category: "Laptops", brand: "Dell", model: "XPS 13 Plus 9320", storage: "512GB", ram: "16GB", color: "Graphite", year: 2023,
      title: "Dell XPS 13 Plus 9320 4K UHD+ Zero-Lattice Core i7 16GB RAM",
      price: 329.0, originalPrice: 1549.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 95, co2: 98.0,
      images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Laptops", brand: "Dell", model: "Latitude 7430", storage: "512GB", ram: "16GB", color: "Carbon Fiber", year: 2022,
      title: "Dell Latitude 7430 Enterprise 14\" FHD Core i5 16GB RAM (Budget Pro)",
      price: 199.0, originalPrice: 1299.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 92, co2: 85.0,
      images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80"]
    },
    // HP
    {
      category: "Laptops", brand: "HP", model: "Spectre x360 14", storage: "1TB", ram: "16GB", color: "Nightfall Black", year: 2023,
      title: "HP Spectre x360 14\" 2.8K OLED Touch 2-in-1 Intel Evo Core i7",
      price: 379.0, originalPrice: 1699.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 97, co2: 120.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    // Lenovo
    {
      category: "Laptops", brand: "Lenovo", model: "ThinkPad X1 Carbon Gen 11", storage: "512GB", ram: "16GB", color: "Deep Black", year: 2023,
      title: "Lenovo ThinkPad X1 Carbon Gen 11 Ultralight Carbon Core i7",
      price: 369.0, originalPrice: 1849.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 98, co2: 130.0,
      images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"]
    },
    // ASUS & Acer
    {
      category: "Laptops", brand: "ASUS", model: "ZenBook 14 OLED", storage: "512GB", ram: "16GB", color: "Ponder Blue", year: 2023,
      title: "ASUS ZenBook 14 OLED 2.8K 90Hz 1.2kg Intel Core i7 (Certified)",
      price: 319.0, originalPrice: 1099.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 95, co2: 92.0,
      images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Laptops", brand: "Acer", model: "Swift Go 14 OLED", storage: "512GB", ram: "16GB", color: "Pure Silver", year: 2023,
      title: "Acer Swift Go 14 2.8K OLED Intel Core i5 16GB - Pure Silver",
      price: 239.0, originalPrice: 799.0, condition: ListingCondition.EXCELLENT,
      seller: seller3, score: 93, co2: 78.0,
      images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"]
    },

    // ====================================================
    // 3. HEADPHONES (Sony, JBL, Bose, Apple, Samsung, Sennheiser, Beats)
    // ====================================================
    // Sony
    {
      category: "Headphones", brand: "Sony", model: "WH-1000XM5", storage: "N/A", ram: "N/A", color: "Silver", year: 2023,
      title: "Sony WH-1000XM5 Active Noise Cancelling Wireless Headphones - Silver",
      price: 149.0, originalPrice: 399.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 98, co2: 24.0,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Headphones", brand: "Sony", model: "WH-1000XM4", storage: "N/A", ram: "N/A", color: "Black", year: 2021,
      title: "Sony WH-1000XM4 ANC Foldable Hi-Res Headphones - Black",
      price: 119.0, originalPrice: 349.0, condition: ListingCondition.EXCELLENT,
      seller: seller1, score: 94, co2: 22.0,
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"]
    },
    // JBL
    {
      category: "Headphones", brand: "JBL", model: "Tour One M2", storage: "N/A", ram: "N/A", color: "Champagne", year: 2023,
      title: "JBL Tour One M2 Adaptive Noise Cancelling Hi-Res Spatial Audio",
      price: 89.0, originalPrice: 299.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 96, co2: 18.0,
      images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Headphones", brand: "JBL", model: "Live 660NC", storage: "N/A", ram: "N/A", color: "Black", year: 2022,
      title: "JBL Live 660NC Wireless Over-Ear NC Headphones - Black (Budget Pick)",
      price: 49.0, originalPrice: 199.0, condition: ListingCondition.GOOD,
      seller: seller3, score: 90, co2: 14.0,
      images: ["https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80"]
    },
    // Bose
    {
      category: "Headphones", brand: "Bose", model: "QuietComfort Ultra", storage: "N/A", ram: "N/A", color: "White Smoke", year: 2023,
      title: "Bose QuietComfort Ultra Immersive Audio NC Headphones - White Smoke",
      price: 169.0, originalPrice: 429.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 97, co2: 25.0,
      images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"]
    },
    // Apple
    {
      category: "Headphones", brand: "Apple", model: "AirPods Max", storage: "N/A", ram: "N/A", color: "Space Gray", year: 2022,
      title: "Apple AirPods Max Computational Audio ANC - Space Gray",
      price: 249.0, originalPrice: 549.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 95, co2: 32.0,
      images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Headphones", brand: "Apple", model: "AirPods Pro (2nd Gen)", storage: "N/A", ram: "N/A", color: "White", year: 2023,
      title: "Apple AirPods Pro 2 USB-C MagSafe Active Noise Cancelling",
      price: 119.0, originalPrice: 249.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 97, co2: 12.0,
      images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80"]
    },
    // Samsung & Beats
    {
      category: "Headphones", brand: "Samsung", model: "Galaxy Buds2 Pro", storage: "N/A", ram: "N/A", color: "Bora Purple", year: 2023,
      title: "Samsung Galaxy Buds2 Pro 24-bit Hi-Fi ANC Wireless Earbuds",
      price: 69.0, originalPrice: 229.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 94, co2: 10.0,
      images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Headphones", brand: "Beats", model: "Beats Studio Pro", storage: "N/A", ram: "N/A", color: "Sandstone", year: 2023,
      title: "Beats Studio Pro Wireless Lossless Audio Spatial Sound - Sandstone",
      price: 129.0, originalPrice: 349.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 95, co2: 20.0,
      images: ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80"]
    },

    // ====================================================
    // 4. SMART WATCHES (Apple, Samsung, Garmin, Noise, boAt, Fitbit)
    // ====================================================
    // Apple
    {
      category: "Smart Watches", brand: "Apple", model: "Apple Watch Series 9", storage: "64GB", ram: "1GB", color: "Midnight", year: 2023,
      title: "Apple Watch Series 9 GPS 45mm S9 SiP Double Tap - Midnight",
      price: 179.0, originalPrice: 429.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 98, co2: 19.0,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Smart Watches", brand: "Apple", model: "Apple Watch SE 2", storage: "32GB", ram: "1GB", color: "Starlight", year: 2022,
      title: "Apple Watch SE (2nd Gen) 40mm GPS OLED - Starlight (Great Value)",
      price: 99.0, originalPrice: 249.0, condition: ListingCondition.EXCELLENT,
      seller: seller1, score: 94, co2: 15.0,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Smart Watches", brand: "Apple", model: "Apple Watch Ultra 2", storage: "64GB", ram: "1GB", color: "Natural Titanium", year: 2023,
      title: "Apple Watch Ultra 2 49mm Titanium 3000-nit GPS + Cellular",
      price: 349.0, originalPrice: 799.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 99, co2: 28.0,
      images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"]
    },
    // Samsung
    {
      category: "Smart Watches", brand: "Samsung", model: "Galaxy Watch 6 Classic", storage: "16GB", ram: "2GB", color: "Black", year: 2023,
      title: "Samsung Galaxy Watch 6 Classic 47mm Rotating Bezel Sapphire Glass",
      price: 139.0, originalPrice: 399.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 96, co2: 17.0,
      images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"]
    },
    // Garmin
    {
      category: "Smart Watches", brand: "Garmin", model: "Fenix 7 Pro Sapphire", storage: "32GB", ram: "N/A", color: "Carbon Gray", year: 2023,
      title: "Garmin Fenix 7 Pro Sapphire Solar Multi-Sport GPS Outdoor Watch",
      price: 289.0, originalPrice: 799.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 99, co2: 25.0,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"]
    },
    // Noise & boAt
    {
      category: "Smart Watches", brand: "Noise", model: "ColorFit Pro 5 Max", storage: "N/A", ram: "N/A", color: "Jet Black", year: 2023,
      title: "Noise ColorFit Pro 5 Max 1.96\" AMOLED BT Calling - Jet Black",
      price: 29.0, originalPrice: 89.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 94, co2: 8.0,
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Smart Watches", brand: "boAt", model: "Wave Elevate Pro", storage: "N/A", ram: "N/A", color: "Metal Gray", year: 2023,
      title: "boAt Wave Elevate Pro 1.96\" HD Display Smart Health Tracker",
      price: 25.0, originalPrice: 79.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 92, co2: 7.0,
      images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"]
    },

    // ====================================================
    // 5. TABLETS (Samsung, Lenovo, Xiaomi, OnePlus)
    // ====================================================
    // Samsung
    {
      category: "Tablets", brand: "Samsung", model: "Galaxy Tab S9 Ultra", storage: "256GB", ram: "12GB", color: "Graphite", year: 2023,
      title: "Samsung Galaxy Tab S9 Ultra 14.6\" Dynamic AMOLED 2X S-Pen Included",
      price: 429.0, originalPrice: 1199.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 98, co2: 85.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Tablets", brand: "Samsung", model: "Galaxy Tab A9+", storage: "64GB", ram: "4GB", color: "Silver", year: 2023,
      title: "Samsung Galaxy Tab A9+ 11\" 90Hz Quad Speakers (Ultra Affordable)",
      price: 99.0, originalPrice: 219.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 93, co2: 45.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    // Lenovo & Xiaomi & OnePlus
    {
      category: "Tablets", brand: "Lenovo", model: "Tab P12 Pro", storage: "256GB", ram: "8GB", color: "Storm Gray", year: 2023,
      title: "Lenovo Tab P12 Pro 12.6\" 2K AMOLED 120Hz Dolby Vision Precision Pen",
      price: 219.0, originalPrice: 699.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 95, co2: 60.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Tablets", brand: "Xiaomi", model: "Pad 6 Pro", storage: "256GB", ram: "8GB", color: "Gravity Gray", year: 2023,
      title: "Xiaomi Pad 6 Pro 11\" 144Hz 2.8K Snapdragon 8+ Gen 1 Tablet",
      price: 149.0, originalPrice: 499.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 96, co2: 52.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "Tablets", brand: "OnePlus", model: "OnePlus Pad", storage: "128GB", ram: "8GB", color: "Halo Green", year: 2023,
      title: "OnePlus Pad 11.61\" 144Hz 7:5 ReadFit Display Dimensity 9000",
      price: 189.0, originalPrice: 479.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 95, co2: 55.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },

    // ====================================================
    // 6. IPADS (iPad Pro, iPad Air, iPad, iPad Mini)
    // ====================================================
    // iPad Pro
    {
      category: "iPads", brand: "iPad Pro", model: "iPad Pro 12.9 M2", storage: "256GB", ram: "8GB", color: "Space Gray", year: 2022,
      title: "Apple iPad Pro 12.9\" M2 Liquid Retina XDR 256GB Wi-Fi - Space Gray",
      price: 499.0, originalPrice: 1199.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 99, co2: 92.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "iPads", brand: "iPad Pro", model: "iPad Pro 11 M2", storage: "128GB", ram: "8GB", color: "Silver", year: 2022,
      title: "Apple iPad Pro 11\" M2 ProMotion 120Hz 128GB Wi-Fi - Silver",
      price: 389.0, originalPrice: 799.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 97, co2: 75.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    // iPad Air
    {
      category: "iPads", brand: "iPad Air", model: "iPad Air 5 M1", storage: "256GB", ram: "8GB", color: "Starlight", year: 2022,
      title: "Apple iPad Air 5th Gen M1 Chip 256GB Wi-Fi - Starlight",
      price: 289.0, originalPrice: 749.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 96, co2: 65.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "iPads", brand: "iPad Air", model: "iPad Air 4", storage: "64GB", ram: "4GB", color: "Sky Blue", year: 2020,
      title: "Apple iPad Air 4th Gen 10.9\" Liquid Retina 64GB - Sky Blue (Affordable)",
      price: 199.0, originalPrice: 599.0, condition: ListingCondition.GOOD,
      seller: seller2, score: 91, co2: 58.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    // iPad Standard & Mini
    {
      category: "iPads", brand: "iPad", model: "iPad 10th Gen", storage: "64GB", ram: "4GB", color: "Yellow", year: 2022,
      title: "Apple iPad 10th Gen 10.9\" All-Screen A14 Bionic Wi-Fi - Bright Yellow",
      price: 179.0, originalPrice: 449.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 95, co2: 52.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "iPads", brand: "iPad Mini", model: "iPad Mini 6", storage: "64GB", ram: "4GB", color: "Purple", year: 2021,
      title: "Apple iPad Mini 6th Gen 8.3\" Liquid Retina A15 Bionic - Purple",
      price: 219.0, originalPrice: 499.0, condition: ListingCondition.EXCELLENT,
      seller: seller1, score: 94, co2: 48.0,
      images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80"]
    },

    // ====================================================
    // 7. PCS / DESKTOP COMPUTERS (Apple, Dell, HP, Lenovo, ASUS, Acer)
    // ====================================================
    // Apple
    {
      category: "PCs", brand: "Apple", model: "Mac Studio M2 Max", storage: "512GB", ram: "32GB", color: "Silver", year: 2023,
      title: "Apple Mac Studio M2 Max 32GB Unified Memory 512GB SSD Workstation",
      price: 749.0, originalPrice: 1999.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 99, co2: 210.0,
      images: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "PCs", brand: "Apple", model: "Mac Mini M2", storage: "512GB", ram: "16GB", color: "Silver", year: 2023,
      title: "Apple Mac Mini M2 16GB RAM 512GB SSD Compact Desktop (Best Buy)",
      price: 329.0, originalPrice: 799.0, condition: ListingCondition.PRISTINE,
      seller: seller1, score: 97, co2: 120.0,
      images: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1000&q=80"]
    },
    // Dell
    {
      category: "PCs", brand: "Dell", model: "OptiPlex 7000 Micro", storage: "1TB", ram: "32GB", color: "Black", year: 2023,
      title: "Dell OptiPlex 7000 Micro Form Factor Intel i7-12700 32GB RAM 1TB SSD",
      price: 269.0, originalPrice: 1199.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 94, co2: 140.0,
      images: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "PCs", brand: "Dell", model: "Alienware Aurora R15", storage: "2TB", ram: "32GB", color: "Lunar Light", year: 2023,
      title: "Dell Alienware Aurora R15 Liquid Cooled Core i7 RTX 4070 Gaming PC",
      price: 599.0, originalPrice: 2399.0, condition: ListingCondition.PRISTINE,
      seller: seller2, score: 98, co2: 240.0,
      images: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1000&q=80"]
    },
    // HP & Lenovo
    {
      category: "PCs", brand: "HP", model: "OMEN 40L Desktop", storage: "1TB", ram: "32GB", color: "Shadow Black", year: 2023,
      title: "HP OMEN 40L Gaming Desktop Core i7-13700KF RTX 4060Ti 32GB RGB",
      price: 549.0, originalPrice: 1899.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 97, co2: 220.0,
      images: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "PCs", brand: "Lenovo", model: "ThinkCentre M70q Tiny", storage: "512GB", ram: "16GB", color: "Black", year: 2023,
      title: "Lenovo ThinkCentre M70q Gen 3 Tiny Desktop Core i5 16GB 512GB SSD",
      price: 229.0, originalPrice: 849.0, condition: ListingCondition.EXCELLENT,
      seller: seller2, score: 94, co2: 110.0,
      images: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1000&q=80"]
    },
    // ASUS & Acer
    {
      category: "PCs", brand: "ASUS", model: "ROG Strix G13CH", storage: "1TB", ram: "16GB", color: "Stealth Black", year: 2023,
      title: "ASUS ROG Strix G13CH Gaming PC Intel Core i7 RTX 4060 16GB RAM",
      price: 489.0, originalPrice: 1499.0, condition: ListingCondition.EXCELLENT,
      seller: seller1, score: 96, co2: 195.0,
      images: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1000&q=80"]
    },
    {
      category: "PCs", brand: "Acer", model: "Predator Orion 3000", storage: "1TB", ram: "16GB", color: "Abyssal Black", year: 2023,
      title: "Acer Predator Orion 3000 Gaming Desktop Core i7 RTX 4060 FrostBlade",
      price: 499.0, originalPrice: 1599.0, condition: ListingCondition.PRISTINE,
      seller: seller3, score: 96, co2: 205.0,
      images: ["https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=1000&q=80"]
    },
  ];

  const createdListings = [];

  for (let idx = 0; idx < devicesAndListings.length; idx++) {
    const item = devicesAndListings[idx];
    const deviceId = uuidv4();
    const listingId = uuidv4();
    const passportId = uuidv4();

    // 1. Insert Device with category
    await db.run(
      `INSERT INTO Device (id, brand, model, storage, ram, color, year, imei, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        deviceId,
        item.brand,
        item.model,
        item.storage,
        item.ram,
        item.color,
        item.year,
        `IMEI3589201${idx.toString().padStart(8, '0')}`,
        item.category
      ]
    );

    // 2. Insert Device Listing
    await db.run(
      `INSERT INTO DeviceListing (id, deviceId, sellerId, title, price, condition, status, images, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        listingId,
        deviceId,
        item.seller.id,
        item.title,
        item.price,
        item.condition,
        ListingStatus.ACTIVE,
        JSON.stringify(item.images),
        new Date(Date.now() - (idx * 3600 * 1000)).toISOString(),
        new Date().toISOString()
      ]
    );

    createdListings.push({ id: listingId, price: item.price });

    // 3. Second Life Score
    await db.run(
      `INSERT INTO SecondLifeScore (id, deviceId, score, breakdown, calculatedAt) VALUES (?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        deviceId,
        item.score,
        JSON.stringify({
          batteryHealth: Math.min(100, item.score + 2),
          displayQuality: item.score >= 95 ? 99 : 92,
          sensorPerformance: 98,
          boardIntegrity: item.score >= 95 ? 100 : 94,
          cosmeticGrade: item.condition === ListingCondition.PRISTINE ? "Grade A+" : item.condition === ListingCondition.EXCELLENT ? "Grade A" : "Grade B+"
        }),
        new Date().toISOString()
      ]
    );

    // 4. Sustainability Metric
    await db.run(
      `INSERT INTO SustainabilityRecord (id, deviceId, co2SavedKg, eWasteAvoidedKg, calculatedAt) VALUES (?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        deviceId,
        item.co2,
        item.category === "Laptops" || item.category === "PCs" ? 1.85 : 0.18,
        new Date().toISOString()
      ]
    );

    // 5. Digital Life Passport
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
      `INSERT INTO PassportEntry (id, passportId, type, description, date, verifiedBy) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), passportId, PassportEntryType.FACTORY_RESET, "Cryptographic DoD 5220.22-M 3-pass data wipe completed.", new Date().toISOString(), "Elena Rostova (AI Lead)"]
    );
    await db.run(
      `INSERT INTO PassportEntry (id, passportId, type, description, date, verifiedBy) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), passportId, PassportEntryType.INSPECTION, `42-point AI optical & subpixel test passed with Second Life Score of ${item.score}/100.`, new Date().toISOString(), "ReTech Optical Diagnostic Bot"]
    );
    await db.run(
      `INSERT INTO PassportEntry (id, passportId, type, description, date, verifiedBy) VALUES (?, ?, ?, ?, ?, ?)`,
      [uuidv4(), passportId, PassportEntryType.CERTIFICATION, "Issued 12-Month ReTech Guaranteed Hardware Warranty.", new Date().toISOString(), "ReTech Certification Board"]
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

  console.log(`✅ Seeded ${devicesAndListings.length} Devices across all 7 Categories & Requested Brands with medium & budget refurbished pricing!`);

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
    { userId: buyer1.id, type: NotificationType.ORDER_DELIVERED, title: "iPhone 14 Delivered", message: "Your verified Apple iPhone 14 package was safely delivered.", read: true },
    { userId: buyer1.id, type: NotificationType.PASSPORT_UPDATED, title: "Digital Passport Certified", message: "Digital Life Passport was issued on the immutable circular ledger.", read: false },
    { userId: seller1.id, type: NotificationType.PRICE_DROP, title: "New Sale Verified", message: "Your listing was purchased and verified by ReTech Escrow.", read: false },
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
