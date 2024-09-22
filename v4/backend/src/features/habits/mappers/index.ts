import type { Entries } from "@/types";
import type { DbHabit, Habit } from "../types";

import { createId } from "@/lib/id";

export const fromDb = (habit: DbHabit) => {
  return {
    id: habit.id,
    title: habit.title,
    createdAt: new Date(habit.created_at),
    updatedAt: habit.updated_at ? new Date(habit.updated_at) : null,
    deletedAt: habit.deleted_at ? new Date(habit.deleted_at) : null,
    publishedAt: habit.published_at ? new Date(habit.published_at) : null,
    endedAt: habit.ended_at ? new Date(habit.ended_at) : null,
    categories: habit.categories.split(","),
    userId: habit.user_id,
    rule: habit.rule,
  };
};

export const createHabit = (habit: Partial<Habit>): Habit => {
  return {
    id: habit.id ?? createId(),
    title: habit.title ?? "",
    categories: habit.categories ?? [],
    userId: habit.userId ?? "",
    rule: habit.rule ?? "daily",
    createdAt: habit.createdAt ?? new Date(),
    publishedAt: habit.publishedAt ?? new Date(),
    updatedAt: habit.updatedAt ?? new Date(),
    deletedAt: habit.deletedAt ?? null,
    endedAt: habit.endedAt ?? null,
  };
};

export const toDb = (data: Habit) => {
  const habit = createHabit(data);
  const entries = Object.entries(habit) as Entries<Habit>;
  const dbHabit = {} as DbHabit;

  for (const entry of entries) {
    if (!entry) continue;
    const [key, value] = entry;
    switch (key) {
      case "id":
        dbHabit.id = value;
        break;
      case "title":
        dbHabit.title = value;
        break;
      case "categories":
        dbHabit.categories = value?.join(",");
        break;
      case "userId":
        dbHabit.user_id = value;
        break;
      case "rule":
        dbHabit.rule = value;
        break;
      case "createdAt":
        dbHabit.created_at = value?.toISOString();
        break;
      case "updatedAt":
        dbHabit.updated_at = value?.toISOString();
        break;
      case "deletedAt":
        dbHabit.deleted_at = value?.toISOString() ?? null;
        break;
      case "endedAt":
        dbHabit.ended_at = value?.toISOString() ?? null;
        break;
      case "publishedAt":
        dbHabit.published_at = value?.toISOString() ?? null;
        break;
      default:
        break;
    }
  }
  return dbHabit;
};
