import { env } from "../lib/env";
import type { Database } from "better-sqlite3";

import BetterSqlite3 from "better-sqlite3";

export const db: Database = new BetterSqlite3(env.DATABASE_URL);
export type DB = typeof db;

export default db;
