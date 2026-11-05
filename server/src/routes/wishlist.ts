import { Router } from "express";
import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";
import type { DB } from "../db/client.js";
import { products, wishlist } from "../db/schema.js";
import { requireUser } from "../lib/auth.js";
import { notFound } from "../lib/errors.js";
import { parse } from "../lib/validate.js";

const param = z.object({ productId: z.coerce.number().int().positive() });

export function wishlistRoutes(db: DB) {
  const router = Router();

  const idsFor = async (userId: number) =>
    (
      await db
        .select({ productId: wishlist.productId })
        .from(wishlist)
        .where(eq(wishlist.userId, userId))
        .orderBy(asc(wishlist.createdAt))
    ).map((r) => r.productId);

  router.get("/", async (req, res) => {
    const user = requireUser(req);
    res.json({ ids: await idsFor(user.id) });
  });

  router.put("/:productId", async (req, res) => {
    const user = requireUser(req);
    const { productId } = parse(param, req.params);
    const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, productId));
    if (!product) throw notFound("Product");
    await db.insert(wishlist).values({ userId: user.id, productId }).onConflictDoNothing();
    res.json({ ids: await idsFor(user.id) });
  });

  router.delete("/:productId", async (req, res) => {
    const user = requireUser(req);
    const { productId } = parse(param, req.params);
    await db.delete(wishlist).where(and(eq(wishlist.userId, user.id), eq(wishlist.productId, productId)));
    res.json({ ids: await idsFor(user.id) });
  });

  return router;
}
