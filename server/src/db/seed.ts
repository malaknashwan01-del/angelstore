import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import type { DB } from "./client.js";
import { catalog } from "./catalog.js";
import { products, reviews, users } from "./schema.js";

const DEMO_REVIEWERS = [
  { name: "Lina H.", email: "lina@demo.angelstore.dev" },
  { name: "Sara M.", email: "sara@demo.angelstore.dev" },
  { name: "Nour K.", email: "nour@demo.angelstore.dev" },
  { name: "Dana A.", email: "dana@demo.angelstore.dev" },
];

const REVIEW_TEXT = {
  makeup: [
    "Beautiful color and it lasts all day. Already ordered a second shade!",
    "Lightweight and blends easily. Looks natural in daylight.",
    "Pretty, but I needed two layers for the full color.",
    "My new everyday favorite, the packaging is gorgeous too.",
  ],
  skincare: [
    "My skin feels so soft after a week. Gentle and no irritation.",
    "Absorbs quickly and sits well under makeup.",
    "Nice texture, results took a few weeks to show.",
    "Holy grail product. My sensitive skin loves it.",
  ],
} as const;

const RATINGS = [5, 5, 4, 5, 4, 3, 5, 4];

/** بيعبي قاعدة البيانات أول مرة بس (إذا ما في منتجات) */
export async function seed(db: DB, admin: { email: string; password: string }) {
  const [{ count } = { count: 0 }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  if (count > 0) return false;

  await db.transaction(async (tx) => {
    const inserted = await tx.insert(products).values(catalog).returning({ id: products.id, category: products.category });

    await tx.insert(users).values({
      name: "Store Admin",
      email: admin.email.toLowerCase(),
      passwordHash: await bcrypt.hash(admin.password, 10),
      role: "admin",
    });

    // حسابات تجريبية بكلمة سر عشوائية — ما حدا بيقدر يدخل عليها
    const demoHash = await bcrypt.hash(crypto.randomUUID(), 10);
    const reviewers = await tx
      .insert(users)
      .values(DEMO_REVIEWERS.map((r) => ({ ...r, passwordHash: demoHash })))
      .returning({ id: users.id });

    const rows = inserted.flatMap((product, i) => {
      const count = 2 + (i % 3); // 2 لـ 4 تقييمات لكل منتج
      return reviewers.slice(0, count).map((user, j) => ({
        productId: product.id,
        userId: user.id,
        rating: RATINGS[(i + j) % RATINGS.length]!,
        body: REVIEW_TEXT[product.category][(i + j) % 4]!,
      }));
    });
    await tx.insert(reviews).values(rows);
  });
  return true;
}
