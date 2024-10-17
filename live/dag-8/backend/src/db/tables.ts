import type { DB } from "./db";

// Lager tabellene
export const createTables = (db: DB) => {
  // Bruker .exec for å kjøre SQL direkte
  // Ren SQL for å lage en tabell med id, name, created_at og updated_at
  db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`);
};
