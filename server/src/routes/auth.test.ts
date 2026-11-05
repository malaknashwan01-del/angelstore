import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { setupTestApp, signUp } from "../test/setup.js";

let ctx: Awaited<ReturnType<typeof setupTestApp>>;
beforeAll(async () => {
  ctx = await setupTestApp();
});
afterAll(() => ctx.close());

describe("auth", () => {
  it("registers, keeps the session in an httpOnly cookie and returns the user", async () => {
    const res = await request(ctx.app)
      .post("/api/auth/register")
      .send({ name: "Lina", email: "Lina@Example.com", password: "password123" })
      .expect(201);

    expect(res.body.user).toMatchObject({ name: "Lina", email: "lina@example.com", role: "customer" });
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.headers["set-cookie"]![0]).toMatch(/angel_session=.+HttpOnly/i);
  });

  it("rejects a duplicate email", async () => {
    await signUp(ctx.app, "dup@test.dev");
    const res = await request(ctx.app)
      .post("/api/auth/register")
      .send({ name: "Dup", email: "dup@test.dev", password: "password123" })
      .expect(409);
    expect(res.body.fields.email).toBeDefined();
  });

  it("validates the form fields", async () => {
    const res = await request(ctx.app).post("/api/auth/register").send({ name: "A", email: "nope", password: "123" }).expect(400);
    expect(Object.keys(res.body.fields).sort()).toEqual(["email", "name", "password"]);
  });

  it("logs in, reads the session with /me and logs out", async () => {
    await signUp(ctx.app, "me@test.dev");
    const agent = request.agent(ctx.app);
    await agent.post("/api/auth/login").send({ email: "me@test.dev", password: "password123" }).expect(200);

    const me = await agent.get("/api/auth/me").expect(200);
    expect(me.body.user.email).toBe("me@test.dev");

    await agent.post("/api/auth/logout").expect(204);
    expect((await agent.get("/api/auth/me")).body.user).toBeNull();
  });

  it("gives the same error for a wrong password and an unknown email", async () => {
    await signUp(ctx.app, "pw@test.dev");
    const wrong = await request(ctx.app).post("/api/auth/login").send({ email: "pw@test.dev", password: "wrong-pass" }).expect(401);
    const unknown = await request(ctx.app).post("/api/auth/login").send({ email: "ghost@test.dev", password: "wrong-pass" }).expect(401);
    expect(wrong.body.error).toBe(unknown.body.error);
  });

  it("ignores a forged session cookie", async () => {
    const res = await request(ctx.app).get("/api/auth/me").set("Cookie", "angel_session=forged.token.value").expect(200);
    expect(res.body.user).toBeNull();
  });
});
