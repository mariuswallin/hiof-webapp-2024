import type { Result } from "@/types";

export type Streak = {
  id: string;
  habitId: string;
  note: string;
  updatedAt: Date;
  createdAt: Date;
};

export type DbStreak = {
  id: string;
  habit_id: string;
  note: string;
  updated_at: string;
  created_at: string;
};

export type StreakService = {
  listByHabit: (habitId: string) => Promise<Result<Streak[]>>;
  addStreakToHabit: (habitId: string, note: string) => Promise<Result<string>>;
};

export type StreakRepository = {
  listByHabit: (habitId: string) => Promise<Result<Streak[]>>;
  addStreakToHabit: (habitId: string, note: string) => Promise<Result<string>>;
};

export type CreateStreakDto = Pick<Streak, "habitId" | "note">;

export type UpdateStreakDto = Partial<Pick<Streak, "note">>;

export const streakFields: (keyof Streak)[] = [
  "id",
  "habitId",
  "note",
  "updatedAt",
  "createdAt",
];

export type StreakKeys = keyof Streak;

export type StreakMap = Map<string, Streak>;
