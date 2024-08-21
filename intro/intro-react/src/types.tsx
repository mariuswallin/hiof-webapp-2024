export type Id = ReturnType<typeof crypto.randomUUID>;
export type Habit = {
  id: Id;
  title: string;
};

export type Streak = {
  id: Id;
  habitId: Id;
  streakCount: number;
};

export const actions = {
  add: "add",
  remove: "remove",
};

export type Action = (typeof actions)[keyof typeof actions];
