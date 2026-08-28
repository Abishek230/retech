import http from "http";
import { createApp } from "./app";
import { env } from "./config/env";
import { initSocketIO } from "./socket";
import { redisClient } from "./config/redis";
import { getDb } from "@retech/database";
async function bootstrap() {
  const app = createApp();
  const server = http.createServer(app);

  // Initialize Socket.io
  initSocketIO(server);

  // Start HTTP server
  server.listen(env.PORT, () => {
    console.log(`
🚀 ===============================================
   ReTech API Backend running successfully!
   - Environment: ${env.NODE_ENV}
   - URL:         http://localhost:${env.PORT}
   - Health:      http://localhost:${env.PORT}/health
   - API Base:    http://localhost:${env.PORT}/api
===============================================
    `);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        if (redisClient) {
          await redisClient.quit();
          console.log("🔴 Redis disconnected.");
        }
        const db = await getDb();
        if (db) {
          await db.close();
          console.log("🐘 SQLite disconnected.");
        }
        process.exit(0);
      } catch (err) {
        console.error("Error during graceful shutdown:", err);
        process.exit(1);
      }
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((err) => {
  console.error("❌ Fatal startup error:", err);
  process.exit(1);
});
