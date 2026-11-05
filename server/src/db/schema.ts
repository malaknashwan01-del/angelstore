import {
  boolean, integer, jsonb, pgEnum, pgTable, primaryKey, serial, text, timestamp, uniqueIndex,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["customer", "admin"]);
export const categoryEnum = pgEnum("category", ["makeup", "skincare"]);
export const orderStatusEnum = pgEnum("order_status", ["placed", "shipped", "delivered", "cancelled"]);

export const PRODUCT_TYPES = [
  "lipstick", "gloss", "blush", "compact", "palette", "mascara", "foundation",
  "toner", "serum", "dropper", "pump", "jar", "tube", "balm",
] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("customer"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  category: categoryEnum("category").notNull(),
  type: text("type", { enum: PRODUCT_TYPES }).notNull(),
  color: text("color").notNull(),
  // السعر بالسنت عشان نتجنب أخطاء الكسور العشرية
  priceCents: integer("price_cents").notNull(),
  description: text("description").notNull(),
  bestseller: boolean("bestseller").notNull().default(false),
  shades: jsonb("shades").$type<string[]>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    body: text("body").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  // تقييم واحد لكل مستخدم على كل منتج
  (t) => [uniqueIndex("reviews_user_product").on(t.userId, t.productId)]
);

export const wishlist = pgTable(
  "wishlist",
  {
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.productId] })]
);

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  status: orderStatusEnum("status").notNull().default("placed"),
  subtotalCents: integer("subtotal_cents").notNull(),
  shippingCents: integer("shipping_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  shipping: jsonb("shipping")
    .$type<{ fullName: string; email: string; phone: string; city: string; address: string }>()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  // إذا انحذف المنتج بيضل الطلب محفوظ بالاسم والسعر وقت الشراء
  productId: integer("product_id").references(() => products.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull(),
  shade: text("shade"),
});
