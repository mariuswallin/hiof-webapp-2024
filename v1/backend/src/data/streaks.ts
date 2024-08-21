import { habits } from "./habits";

export { streaks };

const streaks = new Map(
  habits.map((habit) => [
    habit.id,
    {
      id: crypto.randomUUID(),
      habitId: habit.id,
      streakCount: 0,
    },
  ])
);
