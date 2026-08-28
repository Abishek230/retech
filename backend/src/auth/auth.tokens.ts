import jwt from "jsonwebtoken";
import { Response } from "express";
import { Role } from "@retech/database";
import { env } from "../config/env";

export interface TokenPayload {
  userId: string;
  email: string;
  role: Role;
}

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "retech_super_secret_jwt_key_2026_change_in_production";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || `${ACCESS_TOKEN_SECRET}_refresh`;

// Access token: 15 minutes (900 seconds)
export const ACCESS_TOKEN_EXPIRY = "15m";
// Refresh token: 7 days (604800 seconds)
export const REFRESH_TOKEN_EXPIRY = "7d";
export const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

export function generateAuthTokens(payload: TokenPayload) {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
}

export function setRefreshTokenCookie(res: Response, refreshToken: string) {
  res.cookie("retech_refresh_token", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    path: "/",
  });
}

export function clearRefreshTokenCookie(res: Response) {
  res.clearCookie("retech_refresh_token", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
}
