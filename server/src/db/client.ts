import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema.js";

export type DB = PgDatabase<PgQueryResultHKT, typeof schema>;

const migrationsFolder = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../drizzle");

/**
 * بيرجّع اتصال بقاعدة البيانات وبيطبّق الـ migrations.
 * - url بيبدأ بـ postgres://  → PostgreSQL حقيقي (Neon بالنشر)
 * - url = "memory://"         → قاعدة بالذاكرة للاختبارات
 * - بدون url                  → PGlite محفوظ بمجلد .data للتطوير
 */
export async function createDb(url?: string): Promise<{ db: DB; close: () => Promise<void> }> {
  if (url?.startsWith("postgres")) {
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");
    const pool = new Pool({ connectionString: url });
    const db = drizzle(pool, { schema });
    await migrate(db, { migrationsFolder });
    return { db: db as unknown as DB, close: () => pool.end() };
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  let client;
  if (url === "memory://") {
    client = new PGlite();
  } else {
    mkdirSync(".data", { recursive: true });
    client = new PGlite(".data/pgdata");
  }
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder });
  return { db: db as unknown as DB, close: () => client.close() };
}
