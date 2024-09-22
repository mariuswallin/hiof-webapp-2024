// testSetup.ts

import Database from "better-sqlite3";

import type { DB } from "@/db/db";
import { createHabitRepository } from "../repository";
import type { StreakService } from "@/features/streaks/types";
import { createHabitService } from "../service";
import { createHabitController } from "../controller";

export function createTestDb(): DB {
  const db = new Database(":memory:");

  db.exec(`

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        categories TEXT NOT NULL,
        user_id TEXT NOT NULL,
        rule TEXT DEFAULT 'daily',
        ended_at TEXT,
        deleted_at TEXT,
        published_at TEXT,
        updated_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
  `);

  return db;
}

export function seedTestDb(db: DB): void {
  const insertUser = db.prepare(
    "INSERT INTO users (id, email, name) VALUES (?, ?, ?)"
  );

  const insertHabit = db.prepare(
    "INSERT INTO habits (id, title, user_id, categories, published_at) VALUES (?, ?, ?, ?, ?)"
  );
  db.transaction(() => {
    insertUser.run("user1", "test@test.no", "Test User");
    insertUser.run("user2", "test2@test.no", "Test User 2");

    insertHabit.run(
      "1",
      "Morning Jog",
      "user1",
      "training",
      new Date().toISOString()
    );
    insertHabit.run("2", "Read a Book", "user1", "reading", null);
    insertHabit.run("3", "Meditate", "user2", "mindfulness", null);
  })();
}

export function cleanTestDb(db: DB): void {
  db.exec("DELETE FROM habits");
  db.exec("DELETE FROM users");
}

export function setupTestEnvironment() {
  const db = createTestDb();
  seedTestDb(db);

  const habitRepository = createHabitRepository(db);
  const mockStreakService: StreakService = {
    // Implementer mock metoder etter behov
    listByHabit: async () => ({ success: true, data: [] }),
  };
  const habitService = createHabitService(habitRepository, mockStreakService);
  const habitController = createHabitController(habitService);

  return { db, habitRepository, habitService, habitController };
}
