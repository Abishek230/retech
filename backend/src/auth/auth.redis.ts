import { redisClient } from "../config/redis";

const inMemorySessionStore = new Map<string, { token: string; expiresAt: number }>();
const inMemoryOtpStore = new Map<string, { otp: string; expiresAt: number }>();

const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const OTP_TTL_SECONDS = 5 * 60; // 5 minutes

// ----------------------------------------------------
// Refresh Token Session Handlers
// ----------------------------------------------------
export async function storeRefreshTokenSession(
  userId: string,
  refreshToken: string
): Promise<void> {
  const key = `retech:session:${userId}`;
  try {
    if (redisClient && redisClient.status === "ready") {
      await redisClient.set(key, refreshToken, "EX", REFRESH_TTL_SECONDS);
      return;
    }
  } catch (err: any) {
    console.warn("⚠️ [Redis] Store session fallback:", err.message);
  }

  // In-memory fallback
  inMemorySessionStore.set(key, {
    token: refreshToken,
    expiresAt: Date.now() + REFRESH_TTL_SECONDS * 1000,
  });
}

export async function validateRefreshTokenSession(
  userId: string,
  refreshToken: string
): Promise<boolean> {
  const key = `retech:session:${userId}`;
  try {
    if (redisClient && redisClient.status === "ready") {
      const storedToken = await redisClient.get(key);
      return storedToken === refreshToken;
    }
  } catch (err: any) {
    console.warn("⚠️ [Redis] Validate session fallback:", err.message);
  }

  // In-memory fallback
  const session = inMemorySessionStore.get(key);
  if (session && session.expiresAt > Date.now()) {
    return session.token === refreshToken;
  }
  return false;
}

export async function revokeRefreshTokenSession(userId: string): Promise<void> {
  const key = `retech:session:${userId}`;
  try {
    if (redisClient && redisClient.status === "ready") {
      await redisClient.del(key);
      return;
    }
  } catch (err: any) {
    console.warn("⚠️ [Redis] Revoke session fallback:", err.message);
  }

  inMemorySessionStore.delete(key);
}

// ----------------------------------------------------
// OTP Storage Handlers (5-minute TTL)
// ----------------------------------------------------
export async function storeOtp(
  email: string,
  otp: string,
  purpose = "LOGIN"
): Promise<void> {
  const key = `retech:otp:${purpose.toLowerCase()}:${email.toLowerCase()}`;
  try {
    if (redisClient && redisClient.status === "ready") {
      await redisClient.set(key, otp, "EX", OTP_TTL_SECONDS);
      return;
    }
  } catch (err: any) {
    console.warn("⚠️ [Redis] Store OTP fallback:", err.message);
  }

  inMemoryOtpStore.set(key, {
    otp,
    expiresAt: Date.now() + OTP_TTL_SECONDS * 1000,
  });
}

export async function verifyAndConsumeOtp(
  email: string,
  otp: string,
  purpose = "LOGIN"
): Promise<boolean> {
  const key = `retech:otp:${purpose.toLowerCase()}:${email.toLowerCase()}`;
  try {
    if (redisClient && redisClient.status === "ready") {
      const storedOtp = await redisClient.get(key);
      if (storedOtp === otp) {
        await redisClient.del(key);
        return true;
      }
      return false;
    }
  } catch (err: any) {
    console.warn("⚠️ [Redis] Verify OTP fallback:", err.message);
  }

  const record = inMemoryOtpStore.get(key);
  if (record && record.expiresAt > Date.now()) {
    if (record.otp === otp) {
      inMemoryOtpStore.delete(key);
      return true;
    }
  }
  return false;
}
