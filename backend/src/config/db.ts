import { getDb } from "@retech/database";

export async function checkDatabaseHealth(): Promise<{ status: "connected" | "disconnected"; latencyMs?: number; error?: string }> {
  const start = Date.now();
  try {
    const db = await getDb();
    if (!db) {
      return { status: "disconnected", error: "Database client not initialized" };
    }
    await db.get(`SELECT 1`);
    return {
      status: "connected",
      latencyMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      status: "disconnected",
      error: error.message || "Database query failed",
    };
  }
}

export * from "@retech/database";
