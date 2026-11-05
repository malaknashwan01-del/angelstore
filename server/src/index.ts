import { createApp } from "./app.js";
import { config } from "./config.js";
import { createDb } from "./db/client.js";
import { seed } from "./db/seed.js";

const { db } = await createDb(config.DATABASE_URL);

if (await seed(db, { email: config.ADMIN_EMAIL, password: config.ADMIN_PASSWORD })) {
  console.log(`🌱 Database seeded. Admin: ${config.ADMIN_EMAIL}`);
}

createApp(db).listen(config.PORT, () => {
  console.log(`✿ AngelStore API running on http://localhost:${config.PORT}`);
});
