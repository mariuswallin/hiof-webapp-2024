import { env } from "@/lib/env";
import { makeLogger } from "@/lib/logger";
import Database from "better-sqlite3";

export const db = new Database(env.DATABASE_URL, {
  verbose: (message: unknown) => makeLogger().info(`${message}`),
});

export type DB = typeof db;

export default db;
