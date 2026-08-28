import { Request, Response, NextFunction } from "express";
import { getDb, OrderStatus } from "@retech/database";

function resolveUserId(req: Request): string {
  if (req.user?.userId) return req.user.userId;
  if (req.query?.userId) return String(req.query.userId);
  return "demo_buyer_user_1";
}

// ----------------------------------------------------
// 1. GET /orders (Buyer Order History)
// ----------------------------------------------------
export async function getOrdersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = resolveUserId(req);
    const db = await getDb();

    const orders = await db.all(`
      SELECT o.*,
        l.id as listing_id, l.title as listing_title, l.price as listing_price, l.condition as listing_condition, l.images as listing_images, l.deviceId, l.sellerId,
        d.id as device_id, d.brand, d.model, d.storage, d.ram, d.color, d.year, d.imei,
        w.id as warranty_id, w.duration, 'STANDARD' as tier, w.status as warranty_status, w.expiresAt, w.terms as warranty_terms,
        s.id as seller_user_id, s.name as seller_name, s.avatar as seller_avatar
      FROM "Order" o
      LEFT JOIN DeviceListing l ON o.listingId = l.id
      LEFT JOIN Device d ON l.deviceId = d.id
      LEFT JOIN Warranty w ON o.id = w.orderId
      LEFT JOIN User s ON l.sellerId = s.id
      WHERE o.buyerId = ?
      ORDER BY o.createdAt DESC
    `, [userId]);

    const formattedOrders = await Promise.all(orders.map(async (o: any) => {
      let parsedImages = [];
      if (Array.isArray(o.listing_images)) {
        parsedImages = o.listing_images;
      } else if (typeof o.listing_images === "string") {
        try {
          parsedImages = JSON.parse(o.listing_images);
        } catch {
          parsedImages = [o.listing_images];
        }
      }

      const digitalPassport = o.deviceId ? await db.all(`SELECT * FROM DigitalLifePassport WHERE deviceId = ?`, [o.deviceId]) : [];
      const secondLifeScores = o.deviceId ? await db.all(`SELECT * FROM SecondLifeScore WHERE deviceId = ? ORDER BY calculatedAt DESC LIMIT 1`, [o.deviceId]) : [];
      const sellerProfile = o.sellerId ? await db.get(`SELECT * FROM SellerProfile WHERE userId = ?`, [o.sellerId]) : null;
      
      return {
        id: o.id,
        listingId: o.listingId,
        buyerId: o.buyerId,
        amount: o.amount,
        status: o.status,
        paymentIntentId: o.paymentIntentId,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        listing: o.listing_id ? {
          id: o.listing_id,
          title: o.listing_title,
          price: o.listing_price,
          condition: o.listing_condition,
          images: parsedImages,
          deviceId: o.deviceId,
          sellerId: o.sellerId,
          device: {
            id: o.device_id,
            brand: o.brand,
            model: o.model,
            storage: o.storage,
            ram: o.ram,
            color: o.color,
            year: o.year,
            imei: o.imei,
            digitalPassport,
            secondLifeScores,
          },
          seller: o.seller_user_id ? {
            id: o.seller_user_id,
            name: o.seller_name,
            avatar: o.seller_avatar,
            sellerProfile,
          } : null
        } : null,
        warranty: o.warranty_id ? {
          id: o.warranty_id,
          orderId: o.id,
          duration: o.duration,
          tier: o.tier,
          status: o.warranty_status,
          expiresAt: o.expiresAt,
          terms: o.warranty_terms,
        } : null
      };
    }));

    return res.json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 2. GET /orders/:id (Full Order Detail)
// ----------------------------------------------------
export async function getOrderByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const orderRow = await db.get(`
      SELECT o.*,
        l.id as listing_id, l.title as listing_title, l.price as listing_price, l.condition as listing_condition, l.images as listing_images, l.deviceId, l.sellerId,
        d.id as device_id, d.brand, d.model, d.storage, d.ram, d.color, d.year, d.imei,
        w.id as warranty_id, w.duration, 'STANDARD' as tier, w.status as warranty_status, w.expiresAt, w.terms as warranty_terms,
        s.id as seller_user_id, s.name as seller_name, s.email as seller_email, s.avatar as seller_avatar,
        b.id as buyer_user_id, b.name as buyer_name, b.email as buyer_email
      FROM "Order" o
      LEFT JOIN DeviceListing l ON o.listingId = l.id
      LEFT JOIN Device d ON l.deviceId = d.id
      LEFT JOIN Warranty w ON o.id = w.orderId
      LEFT JOIN User s ON l.sellerId = s.id
      LEFT JOIN User b ON o.buyerId = b.id
      WHERE o.id = ?
    `, [id]);

    if (!orderRow) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    let parsedImages = [];
    if (Array.isArray(orderRow.listing_images)) {
      parsedImages = orderRow.listing_images;
    } else if (typeof orderRow.listing_images === "string") {
      try {
        parsedImages = JSON.parse(orderRow.listing_images);
      } catch {
        parsedImages = [orderRow.listing_images];
      }
    }

    const digitalPassport = orderRow.deviceId ? await db.all(`SELECT * FROM DigitalLifePassport WHERE deviceId = ?`, [orderRow.deviceId]) : [];
    const passportEntries = await Promise.all(digitalPassport.map(async (dp: any) => {
      const entries = await db.all(`SELECT * FROM PassportEntry WHERE passportId = ?`, [dp.id]);
      return { ...dp, entries };
    }));
    const secondLifeScores = orderRow.deviceId ? await db.all(`SELECT * FROM SecondLifeScore WHERE deviceId = ? ORDER BY calculatedAt DESC LIMIT 1`, [orderRow.deviceId]) : [];
    const sustainabilityRecords = orderRow.deviceId ? await db.all(`SELECT * FROM SustainabilityRecord WHERE deviceId = ? ORDER BY calculatedAt DESC LIMIT 1`, [orderRow.deviceId]) : [];
    const sellerProfile = orderRow.sellerId ? await db.get(`SELECT * FROM SellerProfile WHERE userId = ?`, [orderRow.sellerId]) : null;

    const order = {
      id: orderRow.id,
      listingId: orderRow.listingId,
      buyerId: orderRow.buyerId,
      amount: orderRow.amount,
      status: orderRow.status,
      paymentIntentId: orderRow.paymentIntentId,
      createdAt: orderRow.createdAt,
      updatedAt: orderRow.updatedAt,
      listing: orderRow.listing_id ? {
        id: orderRow.listing_id,
        title: orderRow.listing_title,
        price: orderRow.listing_price,
        condition: orderRow.listing_condition,
        images: parsedImages,
        deviceId: orderRow.deviceId,
        sellerId: orderRow.sellerId,
        device: {
          id: orderRow.device_id,
          brand: orderRow.brand,
          model: orderRow.model,
          storage: orderRow.storage,
          ram: orderRow.ram,
          color: orderRow.color,
          year: orderRow.year,
          imei: orderRow.imei,
          digitalPassport: passportEntries,
          secondLifeScores,
          sustainabilityRecords,
        },
        seller: orderRow.seller_user_id ? {
          id: orderRow.seller_user_id,
          name: orderRow.seller_name,
          email: orderRow.seller_email,
          avatar: orderRow.seller_avatar,
          sellerProfile,
        } : null
      } : null,
      buyer: orderRow.buyer_user_id ? {
        id: orderRow.buyer_user_id,
        name: orderRow.buyer_name,
        email: orderRow.buyer_email,
      } : null,
      warranty: orderRow.warranty_id ? {
        id: orderRow.warranty_id,
        orderId: orderRow.id,
        duration: orderRow.duration,
        tier: orderRow.tier,
        status: orderRow.warranty_status,
        expiresAt: orderRow.expiresAt,
        terms: orderRow.warranty_terms,
      } : null
    };

    // Calculate simulated tracking info
    const trackingNumber = `RET-${order.id.slice(0, 8).toUpperCase()}-US`;
    const tracking = {
      carrier: "FedEx Priority Insured",
      trackingNumber,
      estimatedDelivery: new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      origin: "ReTech Circular Logistics Center, Austin TX",
      destination: "Verified Buyer Address",
      events: [
        { status: "PAID", label: "Payment Confirmed via Stripe Escrow", date: order.createdAt },
        {
          status: "PROCESSING",
          label: "42-Point Pre-Dispatch Optical & Battery Inspection Passed",
          date: new Date(new Date(order.createdAt).getTime() + 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          status: "SHIPPED",
          label: "Dispatched with Carrier Insured Transit",
          date: new Date(new Date(order.createdAt).getTime() + 18 * 60 * 60 * 1000).toISOString(),
        },
      ],
    };

    return res.json({
      success: true,
      data: {
        ...order,
        tracking,
      },
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 3. GET /orders/seller (Seller Fulfillment Orders)
// ----------------------------------------------------
export async function getSellerOrdersHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const sellerId = resolveUserId(req);
    const db = await getDb();

    const sellerUser = await db.get("SELECT role FROM User WHERE id = ?", [sellerId]);
    if (!sellerUser || (sellerUser.role !== "SELLER" && sellerUser.role !== "ADMIN")) {
      return res.status(400).json({ success: false, error: "Seller account required" });
    }

    const orders = await db.all(`
      SELECT o.*,
        l.id as listing_id, l.title as listing_title, l.price as listing_price, l.condition as listing_condition, l.images as listing_images, l.deviceId, l.sellerId,
        d.id as device_id, d.brand, d.model, d.storage, d.ram, d.color, d.year, d.imei,
        w.id as warranty_id, w.duration, 'STANDARD' as tier, w.status as warranty_status, w.expiresAt,
        b.id as buyer_user_id, b.name as buyer_name, b.email as buyer_email
      FROM "Order" o
      JOIN DeviceListing l ON o.listingId = l.id
      LEFT JOIN Device d ON l.deviceId = d.id
      LEFT JOIN Warranty w ON o.id = w.orderId
      LEFT JOIN User b ON o.buyerId = b.id
      WHERE l.sellerId = ?
      ORDER BY o.createdAt DESC
    `, [sellerId]);

    const formattedOrders = orders.map((o: any) => {
      let parsedImages = [];
      if (Array.isArray(o.listing_images)) {
        parsedImages = o.listing_images;
      } else if (typeof o.listing_images === "string") {
        try {
          parsedImages = JSON.parse(o.listing_images);
        } catch {
          parsedImages = [o.listing_images];
        }
      }

      return {
        id: o.id,
        listingId: o.listingId,
        buyerId: o.buyerId,
        amount: o.amount,
        status: o.status,
        paymentIntentId: o.paymentIntentId,
        createdAt: o.createdAt,
        updatedAt: o.updatedAt,
        listing: o.listing_id ? {
          id: o.listing_id,
          title: o.listing_title,
          price: o.listing_price,
          condition: o.listing_condition,
          images: parsedImages,
          deviceId: o.deviceId,
          sellerId: o.sellerId,
          device: {
            id: o.device_id,
            brand: o.brand,
            model: o.model,
            storage: o.storage,
            ram: o.ram,
            color: o.color,
            year: o.year,
            imei: o.imei,
          }
        } : null,
        buyer: o.buyer_user_id ? {
          id: o.buyer_user_id,
          name: o.buyer_name,
          email: o.buyer_email,
        } : null,
        warranty: o.warranty_id ? {
          id: o.warranty_id,
          orderId: o.id,
          duration: o.duration,
          tier: o.tier,
          status: o.warranty_status,
          expiresAt: o.expiresAt,
        } : null
      };
    });

    return res.json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders,
    });
  } catch (error) {
    next(error);
  }
}

// ----------------------------------------------------
// 4. PATCH /orders/:id/status (Update Order Status)
// ----------------------------------------------------
export async function updateOrderStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const db = await getDb();

    if (!status || !Object.values(OrderStatus).includes(status as OrderStatus)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${Object.values(OrderStatus).join(", ")}`,
      });
    }

    await db.run(`UPDATE "Order" SET status = ? WHERE id = ?`, [status, id]);
    
    const updated = await db.get(`
      SELECT o.*,
        l.id as listing_id, l.title as listing_title, l.deviceId, l.sellerId,
        d.id as device_id, d.brand, d.model, d.year
      FROM "Order" o
      LEFT JOIN DeviceListing l ON o.listingId = l.id
      LEFT JOIN Device d ON l.deviceId = d.id
      WHERE o.id = ?
    `, [id]);
    
    const order = {
      id: updated.id,
      listingId: updated.listingId,
      buyerId: updated.buyerId,
      amount: updated.amount,
      status: updated.status,
      paymentIntentId: updated.paymentIntentId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      listing: updated.listing_id ? {
        id: updated.listing_id,
        title: updated.listing_title,
        deviceId: updated.deviceId,
        sellerId: updated.sellerId,
        device: {
          id: updated.device_id,
          brand: updated.brand,
          model: updated.model,
          year: updated.year,
        }
      } : null
    };

    return res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
}
