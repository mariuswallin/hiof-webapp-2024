import { env } from "../lib/env";
import Database from "better-sqlite3";

export const db = new Database(env.DATABASE_URL);
export type DB = typeof db;

export default db;
