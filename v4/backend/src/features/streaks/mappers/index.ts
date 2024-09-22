import { createId } from "@/lib/id";
import type { DbStreak, Streak } from "../types";
import type { Entries } from "@/types";

export const fromDb = (streak: DbStreak) => {
  return {
    id: streak.id,
    habitId: streak.habit_id,
    note: streak.note,
    createdAt: new Date(streak.created_at),
    updatedAt: new Date(streak.updated_at),
  };
};

export const createStreak = (
  streak: Partial<Streak>,
  habitId: string
): Streak => {
  return {
    id: streak.id ?? createId(),
    habitId,
    note: streak.note ?? "",
    createdAt: streak.createdAt ?? new Date(),
    updatedAt: streak.updatedAt ?? new Date(),
  };
};

export const toDb = (data: Partial<Streak>, habitId: string) => {
  const streak = createStreak(data, habitId);
  const entries = Object.entries(streak) as Entries<Streak>;

  const dbStreak = {} as DbStreak;

  for (const entry of entries) {
    if (!entry) continue;
    const [key, value] = entry;
    switch (key) {
      case "id":
        dbStreak.id = value;
        break;
      case "habitId":
        dbStreak.habit_id = value;
        break;
      case "note":
        dbStreak.note = value;
        break;
      case "createdAt":
        dbStreak.created_at = value.toISOString();
        break;
      case "updatedAt":
        dbStreak.updated_at = value?.toISOString();
        break;
    }
  }

  return dbStreak;
};
