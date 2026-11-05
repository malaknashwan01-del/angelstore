import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestApp, signUp, SHIPPING } from "../test/setup.js";

let ctx: Awaited<ReturnType<typeof setupTestApp>>;
beforeAll(async () => {
  ctx = await setupTestApp();
});
afterAll(() => ctx.close());

describe("orders", () => {
  it("requires sign in", async () => {
    await request(ctx.app).post("/api/orders").send({ items: [], shipping: SHIPPING }).expect(401);
  });

  it("prices the order on the server and charges shipping under $50", async () => {
    const agent = await signUp(ctx.app);
    const res = await agent
      .post("/api/orders")
      // السعر المرسل من المتصفح بيتجاهله السيرفر
      .send({ items: [{ productId: 1, quantity: 2, shade: "#a33a4a", price: 0.01 }], shipping: SHIPPING })
      .expect(201);

    expect(res.body.order).toMatchObject({
      status: "placed",
      subtotal: 36,
      shippingCost: 5,
      total: 41,
      items: [{ productId: 1, name: "Velvet Kiss Matte Lipstick", unitPrice: 18, quantity: 2, shade: "#a33a4a" }],
    });
  });

  it("ships free from $50 and uses the first shade by default", async () => {
    const agent = await signUp(ctx.app);
    const res = await agent
      .post("/api/orders")
      .send({ items: [{ productId: 4, quantity: 1 }, { productId: 11, quantity: 1 }], shipping: SHIPPING })
      .expect(201);
    expect(res.body.order.shippingCost).toBe(0);
    expect(res.body.order.total).toBe(64);
    expect(res.body.order.items[0].shade).toBe("#f7d6dc");
  });

  it("rejects unknown products, invalid shades and bad shipping details", async () => {
    const agent = await signUp(ctx.app);
    await agent.post("/api/orders").send({ items: [{ productId: 999, quantity: 1 }], shipping: SHIPPING }).expect(400);
    await agent.post("/api/orders").send({ items: [{ productId: 1, quantity: 1, shade: "#000000" }], shipping: SHIPPING }).expect(400);
    await agent.post("/api/orders").send({ items: [{ productId: 1, quantity: 99 }], shipping: SHIPPING }).expect(400);

    const res = await agent
      .post("/api/orders")
      .send({ items: [{ productId: 1, quantity: 1 }], shipping: { ...SHIPPING, email: "nope", phone: "1" } })
      .expect(400);
    expect(Object.keys(res.body.fields).sort()).toEqual(["shipping.email", "shipping.phone"]);
  });

  it("only shows users their own orders", async () => {
    const alice = await signUp(ctx.app);
    const bob = await signUp(ctx.app);
    const created = await alice.post("/api/orders").send({ items: [{ productId: 12, quantity: 1 }], shipping: SHIPPING }).expect(201);
    const id = created.body.order.id;

    expect((await alice.get("/api/orders")).body.orders.map((o: { id: number }) => o.id)).toEqual([id]);
    await alice.get(`/api/orders/${id}`).expect(200);

    expect((await bob.get("/api/orders")).body.orders).toEqual([]);
    await bob.get(`/api/orders/${id}`).expect(404);
  });
});

describe("wishlist", () => {
  it("adds, lists and removes products", async () => {
    const agent = await signUp(ctx.app);
    await agent.put("/api/wishlist/5").expect(200);
    await agent.put("/api/wishlist/5").expect(200); // مرتين ما بتكرر
    const added = await agent.put("/api/wishlist/9").expect(200);
    expect(added.body.ids).toEqual([5, 9]);

    const removed = await agent.delete("/api/wishlist/5").expect(200);
    expect(removed.body.ids).toEqual([9]);
    await agent.put("/api/wishlist/999").expect(404);
  });

  it("requires sign in", async () => {
    await request(ctx.app).get("/api/wishlist").expect(401);
  });
});
