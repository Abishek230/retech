import { Request, Response } from "express";
import { checkDatabaseHealth } from "../config/db";
import { checkRedisHealth } from "../config/redis";
import { env } from "../config/env";

export async function getHealthHandler(req: Request, res: Response) {
  const dbHealth = await checkDatabaseHealth();
  const redisHealth = await checkRedisHealth();

  const isHealthy = dbHealth.status === "connected" && redisHealth.status === "connected";
  const statusCode = isHealthy ? 200 : 207; // 207 Multi-Status if partial degradation

  return res.status(statusCode).json({
    status: isHealthy ? "ok" : "degraded",
    service: "ReTech API Gateway",
    version: "1.0.0",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services: {
      database: {
        status: dbHealth.status,
        latencyMs: dbHealth.latencyMs,
        ...(dbHealth.error ? { error: dbHealth.error } : {}),
      },
      redis: {
        status: redisHealth.status,
        latencyMs: redisHealth.latencyMs,
        ...(redisHealth.error ? { error: redisHealth.error } : {}),
      },
    },
  });
}
