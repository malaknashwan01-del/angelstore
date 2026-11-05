import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { DB } from "../db/client.js";
import { users } from "../db/schema.js";
import { clearSession, setSession } from "../lib/auth.js";
import { HttpError } from "../lib/errors.js";
import { parse } from "../lib/validate.js";

const email = z.string().trim().toLowerCase().email("Please enter a valid email");

const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(60),
  email,
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

const loginSchema = z.object({ email, password: z.string().min(1, "Please enter your password") });

const publicUser = (u: { id: number; name: string; email: string; role: string }) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
});

export function authRoutes(db: DB, { limit = true } = {}) {
  const router = Router();

  // حماية من تخمين كلمات السر: 20 محاولة كل 15 دقيقة
  if (limit) {
    router.use(["/login", "/register"], rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
  }

  router.post("/register", async (req, res) => {
    const body = parse(registerSchema, req.body);
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, body.email));
    if (existing) throw new HttpError(409, "An account with this email already exists", { email: "Email already registered" });

    const [user] = await db
      .insert(users)
      .values({ name: body.name, email: body.email, passwordHash: await bcrypt.hash(body.password, 10) })
      .returning();
    setSession(res, user!.id);
    res.status(201).json({ user: publicUser(user!) });
  });

  router.post("/login", async (req, res) => {
    const body = parse(loginSchema, req.body);
    const [user] = await db.select().from(users).where(eq(users.email, body.email));
    // نفس الرسالة للإيميل الغلط وكلمة السر الغلط، عشان ما نكشف مين عنده حساب
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      throw new HttpError(401, "Email or password is incorrect");
    }
    setSession(res, user.id);
    res.json({ user: publicUser(user) });
  });

  router.post("/logout", (_req, res) => {
    clearSession(res);
    res.status(204).end();
  });

  router.get("/me", (req, res) => {
    res.json({ user: req.user ? publicUser(req.user) : null });
  });

  return router;
}
