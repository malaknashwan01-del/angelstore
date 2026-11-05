import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import type { DB } from "../db/client.js";
import { orders, PRODUCT_TYPES, products, users } from "../db/schema.js";
import { requireAdmin } from "../lib/auth.js";
import { notFound } from "../lib/errors.js";
import { toCents } from "../lib/money.js";
import { parse } from "../lib/validate.js";
import { loadOrders } from "./orders.js";
import { selectProducts, toProductDto } from "./products.js";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Use a hex color like #e75a8a");

const productInput = z.object({
  name: z.string().trim().min(3, "Name is too short").max(80),
  brand: z.string().trim().min(2, "Brand is required").max(40),
  category: z.enum(["makeup", "skincare"]),
  type: z.enum(PRODUCT_TYPES),
  color: hex,
  price: z.number().positive("Price must be above 0").max(1000),
  description: z.string().trim().min(10, "Description is too short").max(600),
  bestseller: z.boolean().default(false),
  shades: z.array(hex).max(8).optional(),
});

const idParam = z.object({ id: z.coerce.number().int().positive() });
const statusBody = z.object({ status: z.enum(["placed", "shipped", "delivered", "cancelled"]) });

const toRow = ({ price, shades, ...rest }: z.infer<typeof productInput>) => ({
  ...rest,
  priceCents: toCents(price),
  shades: shades?.length ? shades : null,
});

export function adminRoutes(db: DB) {
  const router = Router();
  router.use(requireAdmin);

  const productDto = async (id: number) => {
    const [row] = await selectProducts(db).where(eq(products.id, id)).groupBy(products.id);
    return toProductDto(row!);
  };

  router.post("/products", async (req, res) => {
    const input = parse(productInput, req.body);
    const [created] = await db.insert(products).values(toRow(input)).returning({ id: products.id });
    res.status(201).json({ product: await productDto(created!.id) });
  });

  router.put("/products/:id", async (req, res) => {
    const { id } = parse(idParam, req.params);
    const input = parse(productInput, req.body);
    const [updated] = await db.update(products).set(toRow(input)).where(eq(products.id, id)).returning({ id: products.id });
    if (!updated) throw notFound("Product");
    res.json({ product: await productDto(id) });
  });

  router.delete("/products/:id", async (req, res) => {
    const { id } = parse(idParam, req.params);
    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning({ id: products.id });
    if (!deleted) throw notFound("Product");
    res.status(204).end();
  });

  router.get("/orders", async (_req, res) => {
    const rows = await db
      .select({ order: orders, customer: { name: users.name, email: users.email } })
      .from(orders)
      .innerJoin(users, eq(users.id, orders.userId))
      .orderBy(desc(orders.createdAt), desc(orders.id));
    const full = await loadOrders(db, rows.map((r) => r.order));
    res.json({ orders: full.map((o, i) => ({ ...o, customer: rows[i]!.customer })) });
  });

  router.patch("/orders/:id", async (req, res) => {
    const { id } = parse(idParam, req.params);
    const { status } = parse(statusBody, req.body);
    const [updated] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
    if (!updated) throw notFound("Order");
    const [order] = await loadOrders(db, [updated]);
    res.json({ order });
  });

  return router;
}
