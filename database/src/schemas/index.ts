import { z } from "zod";

// ----------------------------------------------------
// ENUM SCHEMAS & TYPES (Replaces Prisma Enums for SQLite)
// ----------------------------------------------------

export const Role = { BUYER: "BUYER", SELLER: "SELLER", ADMIN: "ADMIN" } as const;
export type Role = typeof Role[keyof typeof Role];
export const RoleEnum = z.enum(["BUYER", "SELLER", "ADMIN"]);

export const PassportEntryType = { REPAIR: "REPAIR", OWNERSHIP: "OWNERSHIP", INSPECTION: "INSPECTION", CERTIFICATION: "CERTIFICATION", FACTORY_RESET: "FACTORY_RESET" } as const;
export type PassportEntryType = typeof PassportEntryType[keyof typeof PassportEntryType];
export const PassportEntryTypeEnum = z.enum(["REPAIR", "OWNERSHIP", "INSPECTION", "CERTIFICATION", "FACTORY_RESET"]);

export const AIRecommendation = { BUY: "BUY", SELL: "SELL", HOLD: "HOLD" } as const;
export type AIRecommendation = typeof AIRecommendation[keyof typeof AIRecommendation];
export const AIRecommendationEnum = z.enum(["BUY", "SELL", "HOLD"]);

export const ListingCondition = { PRISTINE: "PRISTINE", EXCELLENT: "EXCELLENT", GOOD: "GOOD", FAIR: "FAIR" } as const;
export type ListingCondition = typeof ListingCondition[keyof typeof ListingCondition];
export const ListingConditionEnum = z.enum(["PRISTINE", "EXCELLENT", "GOOD", "FAIR"]);

export const ListingStatus = { DRAFT: "DRAFT", ACTIVE: "ACTIVE", RESERVED: "RESERVED", SOLD: "SOLD", ARCHIVED: "ARCHIVED" } as const;
export type ListingStatus = typeof ListingStatus[keyof typeof ListingStatus];
export const ListingStatusEnum = z.enum(["DRAFT", "ACTIVE", "RESERVED", "SOLD", "ARCHIVED"]);

export const OrderStatus = { PENDING: "PENDING", PAID: "PAID", SHIPPED: "SHIPPED", DELIVERED: "DELIVERED", CANCELLED: "CANCELLED", REFUNDED: "REFUNDED" } as const;
export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
export const OrderStatusEnum = z.enum(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]);

export const WarrantyStatus = { ACTIVE: "ACTIVE", EXPIRED: "EXPIRED", VOIDED: "VOIDED", CLAIMED: "CLAIMED" } as const;
export type WarrantyStatus = typeof WarrantyStatus[keyof typeof WarrantyStatus];
export const WarrantyStatusEnum = z.enum(["ACTIVE", "EXPIRED", "VOIDED", "CLAIMED"]);

export const NotificationType = { ORDER_PLACED: "ORDER_PLACED", ORDER_SHIPPED: "ORDER_SHIPPED", ORDER_DELIVERED: "ORDER_DELIVERED", PAYMENT_RECEIVED: "PAYMENT_RECEIVED", LISTING_VIEWED: "LISTING_VIEWED", PRICE_DROP: "PRICE_DROP", REVIEW_RECEIVED: "REVIEW_RECEIVED", WARRANTY_EXPIRING: "WARRANTY_EXPIRING", PASSPORT_UPDATED: "PASSPORT_UPDATED", AI_ANALYSIS_COMPLETE: "AI_ANALYSIS_COMPLETE", ORDER_UPDATE: "ORDER_UPDATE", SYSTEM: "SYSTEM" } as const;
export type NotificationType = typeof NotificationType[keyof typeof NotificationType];
export const NotificationTypeEnum = z.enum(["ORDER_PLACED", "ORDER_SHIPPED", "ORDER_DELIVERED", "PAYMENT_RECEIVED", "LISTING_VIEWED", "PRICE_DROP", "REVIEW_RECEIVED", "WARRANTY_EXPIRING", "PASSPORT_UPDATED", "AI_ANALYSIS_COMPLETE", "ORDER_UPDATE", "SYSTEM"]);

// ----------------------------------------------------
// AUTH SCHEMAS
// ----------------------------------------------------
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: RoleEnum.default("BUYER"),
  businessName: z.string().optional(), // Required if role === SELLER
  avatar: z.string().url().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const SendOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  purpose: z.enum(["REGISTRATION", "LOGIN", "PASSWORD_RESET", "VERIFICATION"]).default("LOGIN"),
});

export const VerifyOtpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain digits only"),
  purpose: z.enum(["REGISTRATION", "LOGIN", "PASSWORD_RESET", "VERIFICATION"]).default("LOGIN"),
});

export const GoogleAuthSchema = z.object({
  code: z.string().min(1, "Google OAuth authorization code required"),
  role: RoleEnum.optional().default("BUYER"),
});

// ----------------------------------------------------
// 1. USER SCHEMA
// ----------------------------------------------------
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  role: RoleEnum.default("BUYER"),
  avatar: z.string().url().nullable().optional(),
  isEmailVerified: z.boolean().default(false),
  googleId: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateUserSchema = CreateUserSchema.partial();

// ----------------------------------------------------
// 2. SELLER PROFILE SCHEMA
// ----------------------------------------------------
export const SellerProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  businessName: z.string().min(2, "Business name required"),
  verified: z.boolean().default(false),
  rating: z.number().min(1).max(5).default(5.0),
  totalSales: z.number().int().nonnegative().default(0),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateSellerProfileSchema = SellerProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ----------------------------------------------------
// 3. DEVICE SCHEMA
// ----------------------------------------------------
export const DeviceSchema = z.object({
  id: z.string().uuid(),
  brand: z.string().min(1, "Brand required"),
  model: z.string().min(1, "Model required"),
  storage: z.string().min(1, "Storage capacity required"),
  ram: z.string().min(1, "RAM required"),
  color: z.string().min(1, "Color required"),
  year: z.number().int().min(2010).max(new Date().getFullYear() + 1),
  imei: z.string().min(14, "IMEI must be at least 14 characters"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateDeviceSchema = DeviceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ----------------------------------------------------
// 4. DEVICE LISTING SCHEMA
// ----------------------------------------------------
export const DeviceListingSchema = z.object({
  id: z.string().uuid(),
  deviceId: z.string().uuid(),
  sellerId: z.string().uuid(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  price: z.number().positive("Price must be positive"),
  condition: ListingConditionEnum.default("EXCELLENT"),
  status: ListingStatusEnum.default("ACTIVE"),
  images: z.array(z.string().url()).default([]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateDeviceListingSchema = DeviceListingSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ----------------------------------------------------
// 5. DIGITAL LIFE PASSPORT SCHEMA
// ----------------------------------------------------
export const DigitalLifePassportSchema = z.object({
  id: z.string().uuid(),
  deviceId: z.string().uuid(),
  history: z.array(z.record(z.any())).default([]),
  repairs: z.array(z.record(z.any())).default([]),
  previousOwners: z.number().int().nonnegative().default(1),
  originalPurchaseDate: z.date().nullable().optional(),
  verifiedAt: z.date().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateDigitalLifePassportSchema = DigitalLifePassportSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ----------------------------------------------------
// 6. PASSPORT ENTRY SCHEMA
// ----------------------------------------------------
export const PassportEntrySchema = z.object({
  id: z.string().uuid(),
  passportId: z.string().uuid(),
  type: PassportEntryTypeEnum,
  description: z.string().min(3, "Description required"),
  date: z.date().default(() => new Date()),
  verifiedBy: z.string().min(1, "Verifier name or AI system required"),
  createdAt: z.date().optional(),
});

export const CreatePassportEntrySchema = PassportEntrySchema.omit({
  id: true,
  createdAt: true,
});

// ----------------------------------------------------
// 7. SECOND LIFE SCORE SCHEMA
// ----------------------------------------------------
export const SecondLifeScoreSchema = z.object({
  id: z.string().uuid(),
  deviceId: z.string().uuid(),
  score: z.number().min(0).max(100),
  breakdown: z.record(z.any()),
  calculatedAt: z.date().default(() => new Date()),
});

export const CreateSecondLifeScoreSchema = SecondLifeScoreSchema.omit({
  id: true,
  calculatedAt: true,
});

// ----------------------------------------------------
// 8. AI DECISION SCHEMA
// ----------------------------------------------------
export const AIDecisionSchema = z.object({
  id: z.string().uuid(),
  deviceId: z.string().uuid(),
  userId: z.string().uuid(),
  recommendation: AIRecommendationEnum,
  reasoning: z.string().min(5, "Reasoning required"),
  confidence: z.number().min(0).max(1),
  createdAt: z.date().default(() => new Date()),
});

export const CreateAIDecisionSchema = AIDecisionSchema.omit({
  id: true,
  createdAt: true,
});

// ----------------------------------------------------
// 9. ORDER SCHEMA
// ----------------------------------------------------
export const OrderSchema = z.object({
  id: z.string().uuid(),
  buyerId: z.string().uuid(),
  listingId: z.string().uuid(),
  amount: z.number().positive("Amount must be positive"),
  status: OrderStatusEnum.default("PENDING"),
  paymentIntentId: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateOrderSchema = OrderSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ----------------------------------------------------
// 10. REVIEW SCHEMA
// ----------------------------------------------------
export const ReviewSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(2, "Comment required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateReviewSchema = ReviewSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ----------------------------------------------------
// 11. SUSTAINABILITY RECORD SCHEMA
// ----------------------------------------------------
export const SustainabilityRecordSchema = z.object({
  id: z.string().uuid(),
  deviceId: z.string().uuid(),
  co2SavedKg: z.number().nonnegative(),
  eWasteAvoidedKg: z.number().nonnegative(),
  calculatedAt: z.date().default(() => new Date()),
});

export const CreateSustainabilityRecordSchema = SustainabilityRecordSchema.omit({
  id: true,
  calculatedAt: true,
});

// ----------------------------------------------------
// 12. NOTIFICATION SCHEMA
// ----------------------------------------------------
export const NotificationSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: NotificationTypeEnum,
  message: z.string().min(1, "Message required"),
  read: z.boolean().default(false),
  createdAt: z.date().optional(),
});

export const CreateNotificationSchema = NotificationSchema.omit({
  id: true,
  createdAt: true,
});

// ----------------------------------------------------
// 13. CART & 14. CART ITEM SCHEMAS
// ----------------------------------------------------
export const CartItemSchema = z.object({
  id: z.string().uuid(),
  cartId: z.string().uuid(),
  listingId: z.string().uuid(),
  quantity: z.number().int().positive().default(1),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  items: z.array(CartItemSchema).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// ----------------------------------------------------
// 15. WARRANTY SCHEMA
// ----------------------------------------------------
export const WarrantySchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  duration: z.number().int().positive().default(12),
  status: WarrantyStatusEnum.default("ACTIVE"),
  expiresAt: z.date(),
  terms: z.string().min(5, "Warranty terms required"),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const CreateWarrantySchema = WarrantySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
