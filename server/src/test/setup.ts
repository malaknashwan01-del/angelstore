import request from "supertest";
import { createApp } from "../app.js";
import { createDb } from "../db/client.js";
import { seed } from "../db/seed.js";

export const ADMIN = { email: "admin@test.dev", password: "admin-pass-123" };

/** قاعدة بيانات جديدة بالذاكرة + السيرفر — لكل ملف اختبار */
export async function setupTestApp() {
  const { db, close } = await createDb("memory://");
  await seed(db, ADMIN);
  const app = createApp(db, { rateLimit: false });
  return { app, db, close };
}

type App = Awaited<ReturnType<typeof setupTestApp>>["app"];

/** agent بيحفظ الـ cookies زي المتصفح */
export async function signUp(app: App, email = `user${Math.random().toString(36).slice(2)}@test.dev`) {
  const agent = request.agent(app);
  await agent.post("/api/auth/register").send({ name: "Test User", email, password: "password123" }).expect(201);
  return agent;
}

export async function signInAdmin(app: App) {
  const agent = request.agent(app);
  await agent.post("/api/auth/login").send(ADMIN).expect(200);
  return agent;
}

export const SHIPPING = {
  fullName: "Sara Ahmad",
  email: "sara@example.com",
  phone: "0599 123 456",
  city: "Gaza",
  address: "Omar Al-Mukhtar St",
};
