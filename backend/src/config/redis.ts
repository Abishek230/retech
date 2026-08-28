import Redis from "ioredis";
import { env } from "./env";

let redisClient: Redis | null = null;
let isRedisConnected = false;

try {
  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 100, 3000);
      return delay;
    },
    reconnectOnError(err) {
      const targetError = "READONLY";
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    },
    lazyConnect: true,
  });

  redisClient.on("connect", () => {
    isRedisConnected = true;
    console.log("🔴 [Redis] Connected successfully");
  });

  redisClient.on("ready", () => {
    isRedisConnected = true;
    console.log("🔴 [Redis] Ready to process commands");
  });

  redisClient.on("error", (err) => {
    isRedisConnected = false;
    // Log concisely to avoid flooding during dev when Redis is launching
    console.warn("⚠️ [Redis] Connection notice:", err.message);
  });

  redisClient.on("close", () => {
    isRedisConnected = false;
  });

  // Attempt initial async connection
  redisClient.connect().catch((err) => {
    console.warn("⚠️ [Redis] Initial connect attempt:", err.message);
  });
} catch (error) {
  console.error("❌ [Redis] Failed to initialize Redis client:", error);
}

export async function checkRedisHealth(): Promise<{ status: "connected" | "disconnected" | "error"; latencyMs?: number; error?: string }> {
  if (!redisClient) {
    return { status: "disconnected", error: "Redis client not initialized" };
  }

  const start = Date.now();
  try {
    const res = await redisClient.ping();
    if (res === "PONG") {
      return { status: "connected", latencyMs: Date.now() - start };
    }
    return { status: "disconnected", error: `Unexpected ping response: ${res}` };
  } catch (error: any) {
    return { status: "disconnected", error: error.message || "Ping failed" };
  }
}

export { redisClient, isRedisConnected };
export default redisClient;
