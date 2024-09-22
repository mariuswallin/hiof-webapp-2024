import db, { type DB } from "./db";
import { seed } from "./seed";
import { createTables } from "./tables";

export const setup = async (db: DB) => {
  await createTables(db);
  await seed(db);
};
