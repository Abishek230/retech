import { getDb } from "./db";

async function setup() {
  const db = await getDb();

  console.log("🌱 [ReTech Database] Creating tables...");

  await db.exec(`
    CREATE TABLE IF NOT EXISTS User (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'BUYER',
      avatar TEXT,
      isEmailVerified BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS SellerProfile (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      userId TEXT UNIQUE NOT NULL REFERENCES User(id),
      businessName TEXT NOT NULL,
      bio TEXT,
      verified BOOLEAN DEFAULT 0,
      tier TEXT DEFAULT 'STANDARD',
      stripeConnectId TEXT,
      idVerified BOOLEAN DEFAULT 0,
      rating REAL DEFAULT 0,
      totalSales INTEGER DEFAULT 0,
      responseRate TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Device (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Mobile Phones',
      storage TEXT NOT NULL,
      ram TEXT NOT NULL,
      color TEXT NOT NULL,
      year INTEGER NOT NULL,
      imei TEXT UNIQUE NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS DeviceListing (
      id TEXT PRIMARY KEY,
      deviceId TEXT NOT NULL REFERENCES Device(id),
      sellerId TEXT NOT NULL REFERENCES User(id),
      title TEXT NOT NULL,
      price REAL NOT NULL,
      condition TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'DRAFT',
      images TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS DigitalLifePassport (
      id TEXT PRIMARY KEY,
      deviceId TEXT UNIQUE NOT NULL REFERENCES Device(id),
      previousOwners INTEGER DEFAULT 1,
      originalPurchaseDate DATETIME,
      history TEXT,
      repairs TEXT,
      verifiedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS PassportEntry (
      id TEXT PRIMARY KEY,
      passportId TEXT NOT NULL REFERENCES DigitalLifePassport(id),
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      verifiedBy TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS SecondLifeScore (
      id TEXT PRIMARY KEY,
      deviceId TEXT NOT NULL REFERENCES Device(id),
      score REAL NOT NULL,
      breakdown TEXT,
      calculatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS SustainabilityRecord (
      id TEXT PRIMARY KEY,
      deviceId TEXT NOT NULL REFERENCES Device(id),
      co2SavedKg REAL NOT NULL,
      eWasteAvoidedKg REAL NOT NULL,
      calculatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS AIDecision (
      id TEXT PRIMARY KEY,
      deviceId TEXT NOT NULL REFERENCES Device(id),
      userId TEXT NOT NULL REFERENCES User(id),
      recommendation TEXT NOT NULL,
      reasoning TEXT NOT NULL,
      confidence REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Order" (
      id TEXT PRIMARY KEY,
      buyerId TEXT NOT NULL REFERENCES User(id),
      listingId TEXT NOT NULL REFERENCES DeviceListing(id),
      amount REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'PENDING',
      paymentIntentId TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Review (
      id TEXT PRIMARY KEY,
      orderId TEXT UNIQUE NOT NULL REFERENCES "Order"(id),
      rating INTEGER NOT NULL,
      comment TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Warranty (
      id TEXT PRIMARY KEY,
      orderId TEXT UNIQUE NOT NULL REFERENCES "Order"(id),
      duration INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'ACTIVE',
      expiresAt DATETIME NOT NULL,
      terms TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Cart (
      id TEXT PRIMARY KEY,
      userId TEXT UNIQUE NOT NULL REFERENCES User(id),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS CartItem (
      id TEXT PRIMARY KEY,
      cartId TEXT NOT NULL REFERENCES Cart(id),
      listingId TEXT NOT NULL REFERENCES DeviceListing(id),
      quantity INTEGER DEFAULT 1,
      addedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Notification (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL REFERENCES User(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("✅ Tables created successfully!");
}

setup().catch(console.error);
