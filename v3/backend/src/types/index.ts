export type ID = ReturnType<typeof crypto.randomUUID>;

export type Streak = {
  id: string;
  habitId: string;
  streakCount: number;
  updatedAt: Date;
};

export type Habit = {
  id: string;
  title: string;
  createdAt: Date;
  categories: string[];
  userId: string;
  endedAt: Date | null;
};

export type StreakMap = Map<string, Streak>;
