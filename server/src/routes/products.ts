import { Router } from "express";
import { and, asc, desc, eq, ilike, or, sql, type SQL } from "drizzle-orm";
import { z } from "zod";
import type { DB } from "../db/client.js";
import { products, reviews, users } from "../db/schema.js";
import { requireUser } from "../lib/auth.js";
import { notFound } from "../lib/errors.js";
import { toDollars } from "../lib/money.js";
import { parse } from "../lib/validate.js";

// متوسط التقييم وعددهم بنحسبهم من جدول التقييمات
const ratingAvg = sql<string | null>`round(avg(${reviews.rating})::numeric, 1)`;
const reviewCount = sql<number>`count(${reviews.id})::int`;

const productColumns = {
  id: products.id,
  name: products.name,
  brand: products.brand,
  category: products.category,
  type: products.type,
  color: products.color,
  priceCents: products.priceCents,
  description: products.description,
  bestseller: products.bestseller,
  shades: products.shades,
  rating: ratingAvg,
  reviews: reviewCount,
};

type ProductRow = {
  priceCents: number;
  rating: string | null;
  shades: string[] | null;
} & Record<string, unknown>;

/** شكل المنتج اللي بيوصل للفرونت */
export function toProductDto<T extends ProductRow>({ priceCents, rating, shades, ...rest }: T) {
  return {
    ...rest,
    price: toDollars(priceCents),
    rating: rating === null ? 0 : Number(rating),
    shades: shades ?? undefined,
  };
}

export function selectProducts(db: DB) {
  return db.select(productColumns).from(products).leftJoin(reviews, eq(reviews.productId, products.id)).$dynamic();
}

const listQuery = z.object({
  category: z.enum(["makeup", "skincare"]).optional(),
  q: z.string().trim().max(60).optional(),
  sort: z.enum(["featured", "price-asc", "price-desc", "rating"]).default("featured"),
  bestseller: z.enum(["true"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(100),
});

const idParam = z.object({ id: z.coerce.number().int().positive() });

const reviewBody = z.object({
  rating: z.number().int().min(1, "Pick a rating").max(5),
  body: z.string().trim().min(3, "Tell us a bit more").max(1000),
});

export function productRoutes(db: DB) {
  const router = Router();

  router.get("/", async (req, res) => {
    const query = parse(listQuery, req.query);

    const filters: SQL[] = [];
    if (query.category) filters.push(eq(products.category, query.category));
    if (query.bestseller) filters.push(eq(products.bestseller, true));
    if (query.q) {
      const like = `%${query.q}%`;
      filters.push(or(ilike(products.name, like), ilike(products.brand, like))!);
    }

    const order = {
      featured: [desc(products.bestseller), asc(products.id)],
      "price-asc": [asc(products.priceCents), asc(products.id)],
      "price-desc": [desc(products.priceCents), asc(products.id)],
      rating: [sql`${ratingAvg} desc nulls last`, asc(products.id)],
    }[query.sort];

    const rows = await selectProducts(db)
      .where(and(...filters))
      .groupBy(products.id)
      .orderBy(...order)
      .limit(query.limit);

    res.json({ products: rows.map(toProductDto) });
  });

  router.get("/:id", async (req, res) => {
    const { id } = parse(idParam, req.params);
    const [row] = await selectProducts(db).where(eq(products.id, id)).groupBy(products.id);
    if (!row) throw notFound("Product");
    res.json({ product: toProductDto(row) });
  });

  router.get("/:id/reviews", async (req, res) => {
    const { id } = parse(idParam, req.params);
    const rows = await db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        body: reviews.body,
        createdAt: reviews.createdAt,
        userId: reviews.userId,
        author: users.name,
      })
      .from(reviews)
      .innerJoin(users, eq(users.id, reviews.userId))
      .where(eq(reviews.productId, id))
      .orderBy(desc(reviews.createdAt), desc(reviews.id));
    res.json({ reviews: rows });
  });

  // إضافة تقييم أو تعديل تقييمي السابق
  router.put("/:id/reviews", async (req, res) => {
    const user = requireUser(req);
    const { id } = parse(idParam, req.params);
    const body = parse(reviewBody, req.body);

    const [product] = await db.select({ id: products.id }).from(products).where(eq(products.id, id));
    if (!product) throw notFound("Product");

    const [review] = await db
      .insert(reviews)
      .values({ productId: id, userId: user.id, ...body })
      .onConflictDoUpdate({
        target: [reviews.userId, reviews.productId],
        set: { rating: body.rating, body: body.body, createdAt: new Date() },
      })
      .returning();
    res.status(201).json({ review: { ...review, author: user.name } });
  });

  router.delete("/:id/reviews", async (req, res) => {
    const user = requireUser(req);
    const { id } = parse(idParam, req.params);
    await db.delete(reviews).where(and(eq(reviews.productId, id), eq(reviews.userId, user.id)));
    res.status(204).end();
  });

  return router;
}
