import { db, type DB } from "@/db/db";
import type { DbStreak, Streak, StreakRepository } from "../types";
import type { Result } from "@/types";
import { ResultHandler } from "@/lib/result";
import { fromDb, toDb } from "../mappers";

export const createStreakRepository = (db: DB): StreakRepository => {
  const listByHabit = async (habitId: string): Promise<Result<Streak[]>> => {
    try {
      const query = db.prepare("SELECT * FROM streaks WHERE habit_id = ?;");
      const data = query.all(habitId) as DbStreak[];
      return ResultHandler.success(data.map((streak) => fromDb(streak)));
    } catch (error) {
      return ResultHandler.failure(error, "INTERNAL_SERVER_ERROR");
    }
  };

  const addStreakToHabit = async (
    habitId: string,
    note: string
  ): Promise<Result<string>> => {
    try {
      const streak = toDb({ note }, habitId);

      const query = db.prepare(
        "INSERT INTO streaks (habit_id, id, note, updated_at, created_at) VALUES (?, ?, ?, ?, ?);"
      );
      query.run(
        habitId,
        streak.id,
        streak.note,
        streak.updated_at,
        streak.created_at
      );

      return ResultHandler.success(fromDb(streak).id);
    } catch (error) {
      return ResultHandler.failure(error, "INTERNAL_SERVER_ERROR");
    }
  };

  return {
    listByHabit,
    addStreakToHabit,
  };
};

export const streakRepository = createStreakRepository(db);
