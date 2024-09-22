import type { DB } from "./db";

export const createTables = async (db: DB) => {
  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS habits (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TEXT NOT NULL,
    categories TEXT NOT NULL,
    user_id TEXT NOT NULL,
    rule TEXT NOT NULL,
    ended_at TEXT,
    deleted_at TEXT,
    published_at TEXT,
    updated_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS streaks (
    id TEXT PRIMARY KEY,
    habit_id TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    note TEXT,
    FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
  );
`);
  db.exec(`
  CREATE INDEX IF NOT EXISTS idx_habits_userId ON habits(user_id);
  CREATE INDEX IF NOT EXISTS idx_streaks_habitId ON streaks(habit_id);
`);
};
