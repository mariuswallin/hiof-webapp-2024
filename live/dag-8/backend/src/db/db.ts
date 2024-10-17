import { env } from "../lib/env";
import type { Database } from "better-sqlite3";

import BetterSqlite3 from "better-sqlite3";

// Lager en instans av databasen
export const db: Database = new BetterSqlite3(env.DATABASE_URL);
// Eksporterer databasen som en type så vi kan bruke den i repository
export type DB = typeof db;

export default db;
