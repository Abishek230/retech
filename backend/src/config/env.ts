import dotenv from "dotenv";
import path from "path";
import { z } from "zod";

// Load from root .env or backend local .env
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000").transform((val) => parseInt(val, 10)),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().default("postgresql://retech_admin:retech_secret@localhost:5432/retech_db?schema=public"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  REDIS_HOST: z.string().default("localhost"),
  REDIS_PORT: z.string().default("6379").transform((val) => parseInt(val, 10)),
  REDIS_PASSWORD: z.string().optional(),
  JWT_SECRET: z.string().default("retech_super_secret_jwt_key_2026_change_in_production"),
  JWT_EXPIRES_IN: z.string().default("7d"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());
  process.exit(1);
}

export const env = _env.data;
