import fs from "node:fs/promises";
import { join } from "node:path";
import type { DB } from "./db";
import type { User } from "@/features/users/types";
import type { Habit } from "@/features/habits/types";
import type { Streak } from "@/features/streaks/types";

export const seed = async (db: DB) => {
  const path = join(import.meta.dirname, "data.json");
  const file = await fs.readFile(path, "utf-8");
  const { users, habits, streaks } = JSON.parse(file) as {
    users: User[];
    habits: Habit[];
    streaks: Streak[];
  };

  const insertUser = db.prepare(`
  INSERT INTO users (id, email, name) VALUES (?, ?, ?)
`);

  const insertHabit = db.prepare(`
  INSERT INTO habits (id, title, categories, user_id, rule, created_at, ended_at, deleted_at, published_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

  const insertStreak = db.prepare(`
  INSERT INTO streaks (id, habit_id, note, updated_at, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

  db.transaction(() => {
    for (const user of users) {
      insertUser.run(user.id, user.email, user.name);
    }

    for (const habit of habits) {
      insertHabit.run(
        habit.id,
        habit.title,
        habit.categories,
        habit.userId,
        habit.rule,
        habit.createdAt,
        habit.endedAt ?? null,
        habit.deletedAt ?? null,
        habit.publishedAt ?? null,
        habit.updatedAt ?? null
      );
    }

    for (const streak of streaks) {
      insertStreak.run(
        streak.id,
        streak.habitId,
        streak.note ?? null,
        streak.updatedAt,
        streak.createdAt
      );
    }
  })();
};
