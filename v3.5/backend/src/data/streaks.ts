import type { StreakMap } from "@/types";
import { habits } from "./habits";

export { streaks };

const streaks: StreakMap = new Map(
  habits.map((habit) => [
    habit.id,
    {
      id: crypto.randomUUID(),
      habitId: habit.id,
      streakCount: 0,
      updatedAt: new Date(),
    },
  ])
);
