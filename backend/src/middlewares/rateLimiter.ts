import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 100; // 100 requests per minute per IP

/**
 * Express sliding-window rate limiter for public marketplace endpoints
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "127.0.0.1";
  const now = Date.now();

  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return next();
  }

  store[ip].count += 1;

  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
  res.setHeader(
    "X-RateLimit-Remaining",
    Math.max(0, MAX_REQUESTS - store[ip].count)
  );
  res.setHeader("X-RateLimit-Reset", Math.ceil(store[ip].resetTime / 1000));

  if (store[ip].count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: "Too many requests. Rate limit exceeded (100 requests/minute). Please slow down.",
      retryAfterSeconds: Math.ceil((store[ip].resetTime - now) / 1000),
    });
  }

  next();
}
