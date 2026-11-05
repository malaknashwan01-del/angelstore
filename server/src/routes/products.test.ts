import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestApp, signUp } from "../test/setup.js";

let ctx: Awaited<ReturnType<typeof setupTestApp>>;
beforeAll(async () => {
  ctx = await setupTestApp();
});
afterAll(() => ctx.close());

describe("products", () => {
  it("lists all products with price in dollars and computed ratings", async () => {
    const res = await request(ctx.app).get("/api/products").expect(200);
    expect(res.body.products).toHaveLength(18);
    const lipstick = res.body.products.find((p: { id: number }) => p.id === 1);
    expect(lipstick).toMatchObject({ price: 18, reviews: 2 });
    expect(lipstick.rating).toBeGreaterThan(0);
    expect(lipstick.priceCents).toBeUndefined();
  });

  it("filters by category and searches by name or brand", async () => {
    const skincare = await request(ctx.app).get("/api/products?category=skincare").expect(200);
    expect(skincare.body.products.every((p: { category: string }) => p.category === "skincare")).toBe(true);

    const serum = await request(ctx.app).get("/api/products?q=SERUM").expect(200);
    expect(serum.body.products).toHaveLength(3);

    const brand = await request(ctx.app).get("/api/products?q=petal %26 co").expect(200);
    expect(brand.body.products.every((p: { brand: string }) => p.brand === "Petal & Co")).toBe(true);
  });

  it("sorts by price", async () => {
    const res = await request(ctx.app).get("/api/products?sort=price-asc").expect(200);
    const prices = res.body.products.map((p: { price: number }) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it("rejects an unknown sort or category", async () => {
    await request(ctx.app).get("/api/products?sort=cheapest").expect(400);
    await request(ctx.app).get("/api/products?category=shoes").expect(400);
  });

  it("returns one product or 404", async () => {
    const res = await request(ctx.app).get("/api/products/4").expect(200);
    expect(res.body.product.shades).toHaveLength(6);
    await request(ctx.app).get("/api/products/999").expect(404);
    await request(ctx.app).get("/api/products/abc").expect(400);
  });
});

describe("reviews", () => {
  it("requires sign in to post a review", async () => {
    await request(ctx.app).put("/api/products/2/reviews").send({ rating: 5, body: "Great!" }).expect(401);
  });

  it("adds a review, updates it instead of duplicating, and updates the rating", async () => {
    const agent = await signUp(ctx.app);
    const before = (await request(ctx.app).get("/api/products/2")).body.product;

    await agent.put("/api/products/2/reviews").send({ rating: 1, body: "Not for me." }).expect(201);
    await agent.put("/api/products/2/reviews").send({ rating: 2, body: "Changed my mind a bit." }).expect(201);

    const after = (await request(ctx.app).get("/api/products/2")).body.product;
    expect(after.reviews).toBe(before.reviews + 1);
    expect(after.rating).toBeLessThan(before.rating);

    const list = (await request(ctx.app).get("/api/products/2/reviews")).body.reviews;
    expect(list[0]).toMatchObject({ rating: 2, body: "Changed my mind a bit.", author: "Test User" });
  });

  it("validates the rating and text", async () => {
    const agent = await signUp(ctx.app);
    const res = await agent.put("/api/products/2/reviews").send({ rating: 6, body: "" }).expect(400);
    expect(Object.keys(res.body.fields).sort()).toEqual(["body", "rating"]);
  });

  it("lets a user delete only their own review", async () => {
    const agent = await signUp(ctx.app);
    await agent.put("/api/products/3/reviews").send({ rating: 4, body: "Lovely blush." }).expect(201);
    const count = (await request(ctx.app).get("/api/products/3")).body.product.reviews;
    await agent.delete("/api/products/3/reviews").expect(204);
    expect((await request(ctx.app).get("/api/products/3")).body.product.reviews).toBe(count - 1);
  });
});
