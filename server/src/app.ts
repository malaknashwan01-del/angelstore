import express, { type NextFunction, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import type { DB } from "./db/client.js";
import { loadUser } from "./lib/auth.js";
import { HttpError } from "./lib/errors.js";
import { adminRoutes } from "./routes/admin.js";
import { authRoutes } from "./routes/auth.js";
import { orderRoutes } from "./routes/orders.js";
import { productRoutes } from "./routes/products.js";
import { wishlistRoutes } from "./routes/wishlist.js";

export function createApp(db: DB, { rateLimit = true } = {}) {
  const app = express();

  app.set("trust proxy", 1); // ورا Render / Vercel proxy
  app.use(helmet());
  if (config.CLIENT_ORIGIN) app.use(cors({ origin: config.CLIENT_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.use(loadUser(db));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });
  app.use("/api/auth", authRoutes(db, { limit: rateLimit }));
  app.use("/api/products", productRoutes(db));
  app.use("/api/wishlist", wishlistRoutes(db));
  app.use("/api/orders", orderRoutes(db));
  app.use("/api/admin", adminRoutes(db));

  app.use("/api", (_req, _res, next) => next(new HttpError(404, "Endpoint not found")));

  // كل الأخطاء بتوصل هون، وبترجع للفرونت بنفس الشكل: { error, fields? }
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message, fields: err.details });
      return;
    }
    if (err instanceof SyntaxError) {
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  });

  return app;
}
