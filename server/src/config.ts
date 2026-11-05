import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3001),
  // بدون DATABASE_URL بنستخدم Postgres مدمج (PGlite) محفوظ بمجلد .data
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().min(32).optional(),
  // إذا الفرونت على دومين ثاني بدون proxy
  CLIENT_ORIGIN: z.string().optional(),
  ADMIN_EMAIL: z.string().email().default("admin@angelstore.dev"),
  ADMIN_PASSWORD: z.string().min(8).default("admin1234"),
});

const env = schema.parse(process.env);

if (env.NODE_ENV === "production") {
  if (!env.JWT_SECRET) throw new Error("JWT_SECRET must be set in production (at least 32 characters)");
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL must be set in production");
  // ما بنسمح بكلمة سر الأدمن الافتراضية على النشر
  if (!process.env.ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD must be set in production");
}

export const config = {
  ...env,
  isProd: env.NODE_ENV === "production",
  jwtSecret: env.JWT_SECRET ?? "dev-only-secret-change-me-in-production-please",
};
