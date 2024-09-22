export type Habit = {
  id: string;
  title: string;
  createdAt: Date;
  categories: string[];
  userId: string;
  rule: string;
  endedAt?: Date | null;
  deletedAt?: Date | null;
  publishedAt?: Date | null;
  updatedAt: Date | null;
};

export type DbHabit = {
  id: string;
  title: string;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
  published_at?: string | null;
  ended_at?: string | null;
  categories: string;
  user_id: string;
  rule: string;
};

export type CreateHabitDto = Pick<
  Habit,
  "title" | "categories" | "rule" | "userId"
>;

export type UpdateHabitDto = Partial<
  Pick<
    Habit,
    | "title"
    | "categories"
    | "rule"
    | "endedAt"
    | "deletedAt"
    | "publishedAt"
    | "updatedAt"
  >
>;

export const habitFields: (keyof Habit)[] = [
  "id",
  "title",
  "categories",
  "userId",
  "rule",
  "createdAt",
  "publishedAt",
  "updatedAt",
  "deletedAt",
  "endedAt",
];

export type HabitKeys = keyof Habit;
