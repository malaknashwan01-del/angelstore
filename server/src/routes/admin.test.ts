import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestApp, signInAdmin, signUp, SHIPPING } from "../test/setup.js";

let ctx: Awaited<ReturnType<typeof setupTestApp>>;
beforeAll(async () => {
  ctx = await setupTestApp();
});
afterAll(() => ctx.close());

const NEW_PRODUCT = {
  name: "Dewy Lip Oil",
  brand: "Angel Beauty",
  category: "makeup",
  type: "gloss",
  color: "#f06292",
  price: 16.5,
  description: "A cushiony lip oil that hydrates and adds a glassy tint.",
  bestseller: false,
  shades: ["#f06292", "#e57399"],
};

describe("admin", () => {
  it("blocks guests and customers", async () => {
    await request(ctx.app).get("/api/admin/orders").expect(401);
    const customer = await signUp(ctx.app);
    await customer.get("/api/admin/orders").expect(403);
    await customer.post("/api/admin/products").send(NEW_PRODUCT).expect(403);
  });

  it("creates, updates and deletes a product", async () => {
    const admin = await signInAdmin(ctx.app);
    const created = await admin.post("/api/admin/products").send(NEW_PRODUCT).expect(201);
    const id = created.body.product.id;
    expect(created.body.product).toMatchObject({ name: "Dewy Lip Oil", price: 16.5, reviews: 0, rating: 0 });

    const updated = await admin.put(`/api/admin/products/${id}`).send({ ...NEW_PRODUCT, price: 18, bestseller: true }).expect(200);
    expect(updated.body.product).toMatchObject({ price: 18, bestseller: true });

    await admin.delete(`/api/admin/products/${id}`).expect(204);
    await request(ctx.app).get(`/api/products/${id}`).expect(404);
  });

  it("validates product fields", async () => {
    const admin = await signInAdmin(ctx.app);
    const res = await admin
      .post("/api/admin/products")
      .send({ ...NEW_PRODUCT, color: "pink", price: -1, type: "shoe" })
      .expect(400);
    expect(Object.keys(res.body.fields).sort()).toEqual(["color", "price", "type"]);
  });

  it("keeps old orders when a product is deleted", async () => {
    const admin = await signInAdmin(ctx.app);
    const { body } = await admin.post("/api/admin/products").send(NEW_PRODUCT).expect(201);
    const customer = await signUp(ctx.app);
    const order = await customer.post("/api/orders").send({ items: [{ productId: body.product.id, quantity: 1 }], shipping: SHIPPING }).expect(201);

    await admin.delete(`/api/admin/products/${body.product.id}`).expect(204);
    const after = await customer.get(`/api/orders/${order.body.order.id}`).expect(200);
    expect(after.body.order.items[0]).toMatchObject({ productId: null, name: "Dewy Lip Oil", unitPrice: 16.5 });
  });

  it("lists all orders with the customer and updates the status", async () => {
    const customer = await signUp(ctx.app, "buyer@test.dev");
    const order = await customer.post("/api/orders").send({ items: [{ productId: 10, quantity: 1 }], shipping: SHIPPING }).expect(201);

    const admin = await signInAdmin(ctx.app);
    const list = await admin.get("/api/admin/orders").expect(200);
    const found = list.body.orders.find((o: { id: number }) => o.id === order.body.order.id);
    expect(found.customer.email).toBe("buyer@test.dev");

    await admin.patch(`/api/admin/orders/${found.id}`).send({ status: "shipped" }).expect(200);
    await admin.patch(`/api/admin/orders/${found.id}`).send({ status: "lost" }).expect(400);
    expect((await customer.get(`/api/orders/${found.id}`)).body.order.status).toBe("shipped");
  });
});
