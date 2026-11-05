import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { products as catalog } from "./fixtures";
import type { Order, Product, Review, User } from "../types";

/**
 * API وهمي للاختبارات — بيقلّد السيرفر الحقيقي بشكل مبسط،
 * فالاختبارات بتشتغل بدون سيرفر وبدون قاعدة بيانات.
 */
export const db = {
  user: null as User | null,
  wishlist: [] as number[],
  orders: [] as Order[],
  reviews: [] as Review[],
};

export const CUSTOMER: User = { id: 7, name: "Sara Ahmad", email: "sara@example.com", role: "customer" };
export const ADMIN: User = { id: 1, name: "Store Admin", email: "admin@test.dev", role: "admin" };

export function resetDb() {
  db.user = null;
  db.wishlist = [];
  db.orders = [];
  db.reviews = [{ id: 1, rating: 5, body: "Love this shade!", createdAt: "2026-10-01T10:00:00Z", userId: 99, author: "Lina H." }];
}

const unauthorized = () => HttpResponse.json({ error: "Please sign in" }, { status: 401 });
const find = (id: unknown) => catalog.find((p) => p.id === Number(id));

const SORTS: Record<string, (a: Product, b: Product) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

export const handlers = [
  http.get("*/api/products", ({ request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const q = url.searchParams.get("q")?.toLowerCase();
    const sort = url.searchParams.get("sort");
    let list = catalog.filter(
      (p) => (!category || p.category === category) && (!q || `${p.name} ${p.brand}`.toLowerCase().includes(q))
    );
    if (sort && SORTS[sort]) list = [...list].sort(SORTS[sort]);
    return HttpResponse.json({ products: list });
  }),

  http.get("*/api/products/:id", ({ params }) => {
    const product = find(params.id);
    return product
      ? HttpResponse.json({ product })
      : HttpResponse.json({ error: "Product not found" }, { status: 404 });
  }),

  http.get("*/api/products/:id/reviews", () => HttpResponse.json({ reviews: db.reviews })),

  http.put("*/api/products/:id/reviews", async ({ request }) => {
    if (!db.user) return unauthorized();
    const body = (await request.json()) as { rating: number; body: string };
    if (!body.rating) return HttpResponse.json({ error: "Invalid request", fields: { rating: "Pick a rating" } }, { status: 400 });
    db.reviews = [
      { id: 50, ...body, createdAt: "2026-11-05T10:00:00Z", userId: db.user.id, author: db.user.name },
      ...db.reviews.filter((r) => r.userId !== db.user!.id),
    ];
    return HttpResponse.json({ review: db.reviews[0] }, { status: 201 });
  }),

  http.get("*/api/auth/me", () => HttpResponse.json({ user: db.user })),

  http.post("*/api/auth/login", async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (email === CUSTOMER.email && password === "password123") {
      db.user = CUSTOMER;
      return HttpResponse.json({ user: CUSTOMER });
    }
    return HttpResponse.json({ error: "Email or password is incorrect" }, { status: 401 });
  }),

  http.post("*/api/auth/register", async ({ request }) => {
    const body = (await request.json()) as { name: string; email: string; password: string };
    if (body.password.length < 8) {
      return HttpResponse.json(
        { error: "Invalid request", fields: { password: "Password must be at least 8 characters" } },
        { status: 400 }
      );
    }
    db.user = { id: 8, name: body.name, email: body.email, role: "customer" };
    return HttpResponse.json({ user: db.user }, { status: 201 });
  }),

  http.post("*/api/auth/logout", () => {
    db.user = null;
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("*/api/wishlist", () => (db.user ? HttpResponse.json({ ids: db.wishlist }) : unauthorized())),
  http.put("*/api/wishlist/:id", ({ params }) => {
    if (!db.user) return unauthorized();
    db.wishlist = [...new Set([...db.wishlist, Number(params.id)])];
    return HttpResponse.json({ ids: db.wishlist });
  }),
  http.delete("*/api/wishlist/:id", ({ params }) => {
    if (!db.user) return unauthorized();
    db.wishlist = db.wishlist.filter((x) => x !== Number(params.id));
    return HttpResponse.json({ ids: db.wishlist });
  }),

  http.post("*/api/orders", async ({ request }) => {
    if (!db.user) return unauthorized();
    const body = (await request.json()) as {
      items: { productId: number; quantity: number; shade: string | null }[];
      shipping: Order["shipping"];
    };
    const items = body.items.map((i) => {
      const p = find(i.productId)!;
      return { productId: p.id, name: p.name, unitPrice: p.price, quantity: i.quantity, shade: i.shade };
    });
    const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shippingCost = subtotal >= 50 ? 0 : 5;
    const order: Order = {
      id: 100 + db.orders.length,
      status: "placed",
      createdAt: "2026-11-05T10:00:00Z",
      shipping: body.shipping,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      items,
    };
    db.orders.unshift(order);
    return HttpResponse.json({ order }, { status: 201 });
  }),

  http.get("*/api/orders", () => (db.user ? HttpResponse.json({ orders: db.orders }) : unauthorized())),
  http.get("*/api/orders/:id", ({ params }) => {
    const order = db.orders.find((o) => o.id === Number(params.id));
    return order ? HttpResponse.json({ order }) : HttpResponse.json({ error: "Order not found" }, { status: 404 });
  }),
];

export const server = setupServer(...handlers);
