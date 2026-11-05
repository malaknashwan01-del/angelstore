import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { config } from "../config.js";
import type { DB } from "../db/client.js";
import { users } from "../db/schema.js";
import { HttpError } from "./errors.js";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "customer" | "admin";
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const SESSION_COOKIE = "angel_session";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function setSession(res: Response, userId: number) {
  const token = jwt.sign({ sub: String(userId) }, config.jwtSecret, { expiresIn: "7d" });
  // httpOnly: الجافاسكربت بالمتصفح ما بتقدر تقرأه، فبيحمي من سرقة الجلسة بـ XSS
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: config.isProd,
    sameSite: "lax",
    maxAge: SEVEN_DAYS,
    path: "/",
  });
}

export function clearSession(res: Response) {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

/** بيقرأ الجلسة إذا موجودة ويحط المستخدم بـ req.user — ما بيرفض الطلب */
export const loadUser = (db: DB) => async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) return next();
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
    // بنجيب المستخدم من القاعدة كل مرة، عشان لو انحذف أو تغيرت صلاحيته يبين فوراً
    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, Number(payload.sub)));
    if (user) req.user = user;
  } catch {
    // توكن منتهي أو مزوّر — بنكمل كزائر
  }
  next();
};

export function requireUser(req: Request): AuthUser {
  if (!req.user) throw new HttpError(401, "Please sign in");
  return req.user;
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const user = requireUser(req);
  if (user.role !== "admin") throw new HttpError(403, "Admins only");
  next();
}
