import { Router } from "express";
import { and, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import type { DB } from "../db/client.js";
import { orderItems, orders, products } from "../db/schema.js";
import { requireUser } from "../lib/auth.js";
import { HttpError, notFound } from "../lib/errors.js";
import { shippingFor, toDollars } from "../lib/money.js";
import { parse } from "../lib/validate.js";

export const shippingSchema = z.object({
  fullName: z.string().trim().min(3, "Please enter your full name").max(80),
  email: z.string().trim().email("Please enter a valid email"),
  phone: z.string().trim().regex(/^\+?[\d\s-]{8,15}$/, "Please enter a valid phone number"),
  city: z.string().trim().min(1, "City is required").max(60),
  address: z.string().trim().min(5, "Please enter your address").max(200),
});

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(10),
        shade: z.string().nullable().optional(),
      })
    )
    .min(1, "Your bag is empty")
    .max(50),
  shipping: shippingSchema,
});

type OrderRow = typeof orders.$inferSelect;
type ItemRow = typeof orderItems.$inferSelect;

export function toOrderDto(order: OrderRow, items: ItemRow[]) {
  return {
    id: order.id,
    status: order.status,
    createdAt: order.createdAt,
    shipping: order.shipping,
    subtotal: toDollars(order.subtotalCents),
    shippingCost: toDollars(order.shippingCents),
    total: toDollars(order.totalCents),
    items: items.map((i) => ({
      productId: i.productId,
      name: i.name,
      unitPrice: toDollars(i.unitPriceCents),
      quantity: i.quantity,
      shade: i.shade,
    })),
  };
}

/** بيجيب الطلبات مع عناصرها بطلبين بس بدل طلب لكل طلبية */
export async function loadOrders(db: DB, rows: OrderRow[]) {
  if (rows.length === 0) return [];
  const items = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((o) => o.id)))
    .orderBy(orderItems.id);
  return rows.map((o) => toOrderDto(o, items.filter((i) => i.orderId === o.id)));
}

export function orderRoutes(db: DB) {
  const router = Router();

  router.post("/", async (req, res) => {
    const user = requireUser(req);
    const body = parse(createOrderSchema, req.body);

    // الأسعار من قاعدة البيانات دايماً — ما بنثق بالسعر اللي جاي من المتصفح
    const ids = [...new Set(body.items.map((i) => i.productId))];
    const found = await db.select().from(products).where(inArray(products.id, ids));
    const byId = new Map(found.map((p) => [p.id, p]));

    const lines = body.items.map((item, index) => {
      const product = byId.get(item.productId);
      if (!product) throw new HttpError(400, "Some items are no longer available", { [`items.${index}`]: "Not available" });

      let shade = item.shade ?? null;
      if (product.shades?.length) {
        shade ??= product.shades[0]!;
        if (!product.shades.includes(shade)) {
          throw new HttpError(400, "Invalid shade", { [`items.${index}.shade`]: "Shade not available" });
        }
      } else {
        shade = null;
      }
      return { product, quantity: item.quantity, shade };
    });

    const subtotalCents = lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);
    const shippingCents = shippingFor(subtotalCents);

    const order = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(orders)
        .values({
          userId: user.id,
          subtotalCents,
          shippingCents,
          totalCents: subtotalCents + shippingCents,
          shipping: body.shipping,
        })
        .returning();
      const items = await tx
        .insert(orderItems)
        .values(
          lines.map((l) => ({
            orderId: created!.id,
            productId: l.product.id,
            name: l.product.name,
            unitPriceCents: l.product.priceCents,
            quantity: l.quantity,
            shade: l.shade,
          }))
        )
        .returning();
      return toOrderDto(created!, items);
    });

    res.status(201).json({ order });
  });

  router.get("/", async (req, res) => {
    const user = requireUser(req);
    const rows = await db.select().from(orders).where(eq(orders.userId, user.id)).orderBy(desc(orders.createdAt), desc(orders.id));
    res.json({ orders: await loadOrders(db, rows) });
  });

  router.get("/:id", async (req, res) => {
    const user = requireUser(req);
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) throw notFound("Order");
    // المستخدم بيشوف طلباته بس
    const [row] = await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.userId, user.id)));
    if (!row) throw notFound("Order");
    const [order] = await loadOrders(db, [row]);
    res.json({ order });
  });

  return router;
}
