import { Users } from "@drizzle/schema";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";
import {
  type BetterSQLite3Database,
  drizzle,
} from "drizzle-orm/better-sqlite3";
import { seedDevData } from "@/api/dev-seed";

const sqlite = new Database("./drizzle/db.sqlite");

export const db: BetterSQLite3Database = drizzle(sqlite);

// TODO: remove this dev-only seed before deploying to production.
const DEV_USERNAME = "dev";
const DEV_PASSWORD = "dev";

if (import.meta.env.DEV) {
  const existing = db
    .select()
    .from(Users)
    .where(eq(Users.username, DEV_USERNAME))
    .get();

  const devUser =
    existing ??
    db
      .insert(Users)
      .values({ username: DEV_USERNAME, password: DEV_PASSWORD })
      .returning()
      .get();

  seedDevData(db, devUser.id);
}
