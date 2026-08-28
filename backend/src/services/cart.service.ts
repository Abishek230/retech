import { getDb, ListingStatus } from "@retech/database";
import { redisClient } from "../config/redis";

const CART_TTL_SECONDS = 24 * 60 * 60; // 24-hour inactivity expiration
const inMemoryCartStore = new Map<string, { items: Array<{ listingId: string; quantity: number }>; expiresAt: number }>();

export interface CartItemWithDetails {
  listingId: string;
  quantity: number;
  listing: any;
  subtotal: number;
}

export interface UserCartResponse {
  userId: string;
  items: CartItemWithDetails[];
  itemCount: number;
  subtotal: number;
  platformFee: number; // 5%
  warrantyFee: number; // Free certified coverage ($0)
  total: number;
  carbonOffsetKg: number;
}

export class CartService {
  private static getKey(userId: string): string {
    return `cart:${userId}`;
  }

  /**
   * Retrieves full cart from Redis (with 24h sliding expiration refresh)
   * and hydrates each listing with device details, price, and carbon offsets.
   */
  static async getCart(userId: string): Promise<UserCartResponse> {
    const key = this.getKey(userId);
    let rawItems: Array<{ listingId: string; quantity: number }> = [];

    try {
      if (redisClient && redisClient.status === "ready") {
        const stored = await redisClient.get(key);
        if (stored) {
          rawItems = JSON.parse(stored);
          // Refresh 24-hour sliding TTL on read/activity
          await redisClient.expire(key, CART_TTL_SECONDS);
        }
      } else {
        const mem = inMemoryCartStore.get(key);
        if (mem && mem.expiresAt > Date.now()) {
          rawItems = mem.items;
          mem.expiresAt = Date.now() + CART_TTL_SECONDS * 1000;
        }
      }
    } catch (err: any) {
      console.warn("⚠️ [CartService] Redis read fallback:", err.message);
    }

    if (rawItems.length === 0) {
      return {
        userId,
        items: [],
        itemCount: 0,
        subtotal: 0,
        platformFee: 0,
        warrantyFee: 0,
        total: 0,
        carbonOffsetKg: 0,
      };
    }

    // Hydrate listings from database
    const db = await getDb();
    const listingIds = rawItems.map((i) => i.listingId);

    // SQLite raw query for listings
    const placeholders = listingIds.map(() => '?').join(',');
    const sql = `
      SELECT 
        l.*,
        d.id as device_id, d.brand, d.model, d.storage, d.ram, d.color, d.year, d.imei,
        s.score, s.breakdown,
        sr.co2SavedKg, sr.eWasteAvoidedKg,
        u.id as seller_id, u.name as seller_name, u.avatar as seller_avatar,
        sp.id as sellerProfile_id, sp.businessName as sellerProfile_businessName, sp.rating as sellerProfile_rating
      FROM DeviceListing l
      JOIN Device d ON l.deviceId = d.id
      LEFT JOIN SecondLifeScore s ON d.id = s.deviceId
      LEFT JOIN SustainabilityRecord sr ON d.id = sr.deviceId
      JOIN User u ON l.sellerId = u.id
      LEFT JOIN SellerProfile sp ON u.id = sp.userId
      WHERE l.id IN (${placeholders}) AND l.status = ?
    `;

    const rows = await db.all(sql, [...listingIds, ListingStatus.ACTIVE]);

    const listings = rows.map((row: any) => {
      let parsedImages = [];
      if (Array.isArray(row.images)) {
        parsedImages = row.images;
      } else if (typeof row.images === "string") {
        try {
          parsedImages = JSON.parse(row.images);
        } catch {
          parsedImages = [row.images];
        }
      }

      return {
        id: row.id,
        deviceId: row.deviceId,
        sellerId: row.sellerId,
        title: row.title,
        description: row.description,
        price: row.price,
        condition: row.condition,
        status: row.status,
        images: parsedImages,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        device: {
          id: row.device_id,
          brand: row.brand,
          model: row.model,
          storage: row.storage,
          ram: row.ram,
          color: row.color,
          year: row.year,
          imei: row.imei,
          secondLifeScores: row.score ? [{ score: row.score, breakdown: typeof row.breakdown === "string" ? JSON.parse(row.breakdown) : row.breakdown }] : [],
          sustainabilityRecords: row.co2SavedKg ? [{ co2SavedKg: row.co2SavedKg, eWasteAvoidedKg: row.eWasteAvoidedKg }] : [],
        },
        seller: {
          id: row.seller_id,
          name: row.seller_name,
          avatar: row.seller_avatar,
          sellerProfile: row.sellerProfile_id ? {
            id: row.sellerProfile_id,
            businessName: row.sellerProfile_businessName,
            rating: row.sellerProfile_rating,
          } : null
        }
      };
    });

    const listingMap = new Map<string, any>(listings.map((l: any) => [l.id, l]));

    const items: CartItemWithDetails[] = [];
    let subtotal = 0;
    let carbonOffsetKg = 0;

    for (const raw of rawItems) {
      const listing = listingMap.get(raw.listingId);
      if (listing) {
        const itemSubtotal = listing.price * (raw.quantity || 1);
        subtotal += itemSubtotal;
        carbonOffsetKg += (listing.device?.sustainabilityRecords?.[0]?.co2SavedKg || 54.0) * (raw.quantity || 1);

        items.push({
          listingId: raw.listingId,
          quantity: raw.quantity || 1,
          listing,
          subtotal: itemSubtotal,
        });
      }
    }

    const platformFee = Math.round(subtotal * 0.05 * 100) / 100; // 5% platform fee
    const total = Math.round((subtotal + platformFee) * 100) / 100;

    return {
      userId,
      items,
      itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal,
      platformFee,
      warrantyFee: 0,
      total,
      carbonOffsetKg: Math.round(carbonOffsetKg * 10) / 10,
    };
  }

  /**
   * Adds an item to the user's cart in Redis.
   * Enforces: Only ACTIVE listings can be added.
   */
  static async addToCart(userId: string, listingId: string, quantity = 1): Promise<UserCartResponse> {
    const db = await getDb();
    const listing = await db.get("SELECT * FROM DeviceListing WHERE id = ?", [listingId]);

    if (!listing || listing.status !== ListingStatus.ACTIVE) {
      throw new Error("This listing is no longer active or is already sold.");
    }

    const currentCart = await this.getCart(userId);
    const existingIndex = currentCart.items.findIndex((i) => i.listingId === listingId);

    let updatedRaw: Array<{ listingId: string; quantity: number }> = [];

    if (existingIndex >= 0) {
      updatedRaw = currentCart.items.map((i) =>
        i.listingId === listingId ? { listingId, quantity: i.quantity + quantity } : { listingId: i.listingId, quantity: i.quantity }
      );
    } else {
      updatedRaw = [
        ...currentCart.items.map((i) => ({ listingId: i.listingId, quantity: i.quantity })),
        { listingId, quantity },
      ];
    }

    await this.persistRawCart(userId, updatedRaw);
    return await this.getCart(userId);
  }

  /**
   * Removes an item from the user's cart.
   */
  static async removeFromCart(userId: string, listingId: string): Promise<UserCartResponse> {
    const currentCart = await this.getCart(userId);
    const updatedRaw = currentCart.items
      .filter((i) => i.listingId !== listingId)
      .map((i) => ({ listingId: i.listingId, quantity: i.quantity }));

    await this.persistRawCart(userId, updatedRaw);
    return await this.getCart(userId);
  }

  /**
   * Flushes cart in Redis.
   */
  static async clearCart(userId: string): Promise<void> {
    const key = this.getKey(userId);
    try {
      if (redisClient && redisClient.status === "ready") {
        await redisClient.del(key);
      }
    } catch {
      // Ignore fallback
    }
    inMemoryCartStore.delete(key);
  }

  private static async persistRawCart(
    userId: string,
    items: Array<{ listingId: string; quantity: number }>
  ): Promise<void> {
    const key = this.getKey(userId);
    const serialized = JSON.stringify(items);

    try {
      if (redisClient && redisClient.status === "ready") {
        await redisClient.setex(key, CART_TTL_SECONDS, serialized);
      } else {
        inMemoryCartStore.set(key, {
          items,
          expiresAt: Date.now() + CART_TTL_SECONDS * 1000,
        });
      }
    } catch (err: any) {
      console.warn("⚠️ [CartService] Redis write fallback:", err.message);
      inMemoryCartStore.set(key, {
        items,
        expiresAt: Date.now() + CART_TTL_SECONDS * 1000,
      });
    }
  }
}
