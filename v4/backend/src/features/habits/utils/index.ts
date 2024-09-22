import { z } from "zod";

// ! Ikke i bruk, men en mulig / tryggere måte å validere data på
const habitBaseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  categories: z.array(z.string()),
  userId: z.string().uuid(),
  rule: z.string(),
});

const dateFieldsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
  endedAt: z.coerce.date().nullable().optional(),
  deletedAt: z.coerce.date().nullable().optional(),
  publishedAt: z.coerce.date().nullable().optional(),
});

export const habitSchema = habitBaseSchema.extend({
  ...dateFieldsSchema.shape,
  //streak: streakSchema,
});

export const dbHabitSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
  deleted_at: z.string().nullable().optional(),
  ended_at: z.string().nullable().optional(),
  categories: z.string(),
  user_id: z.string().uuid(),
  rule: z.string(),
});

export const createHabitDtoSchema = habitBaseSchema.pick({
  title: true,
  categories: true,
  rule: true,
  userId: true,
});

export const updateHabitDtoSchema = habitSchema
  .pick({
    title: true,
    categories: true,
    rule: true,
    endedAt: true,
    deletedAt: true,
    publishedAt: true,
    updatedAt: true,
  })
  .partial();

export type Habit = z.infer<typeof habitSchema>;
export type DbHabit = z.infer<typeof dbHabitSchema>;
export type CreateHabitDto = z.infer<typeof createHabitDtoSchema>;
export type UpdateHabitDto = z.infer<typeof updateHabitDtoSchema>;

export const validateHabit = (data: unknown): Habit => habitSchema.parse(data);

export const validateDbHabit = (data: unknown): DbHabit =>
  dbHabitSchema.parse(data);

export const validateCreateHabitDto = (data: unknown): CreateHabitDto =>
  createHabitDtoSchema.parse(data);

export const validateUpdateHabitDto = (data: unknown): UpdateHabitDto =>
  updateHabitDtoSchema.parse(data);

export const dbHabitToHabit = (dbHabit: DbHabit): Habit => {
  const habit: Habit = {
    ...dbHabit,
    categories: JSON.parse(dbHabit.categories),
    createdAt: new Date(dbHabit.created_at),
    updatedAt: dbHabit.updated_at ? new Date(dbHabit.updated_at) : null,
    endedAt: dbHabit.ended_at ? new Date(dbHabit.ended_at) : undefined,
    deletedAt: dbHabit.deleted_at ? new Date(dbHabit.deleted_at) : undefined,
    userId: dbHabit.user_id,
  };
  return validateHabit(habit);
};

export const habitToDbHabit = (habit: Habit): DbHabit => {
  const dbHabit: DbHabit = {
    id: habit.id,
    title: habit.title,
    created_at: habit.createdAt.toISOString(),
    updated_at: habit.updatedAt?.toISOString() ?? null,
    ended_at: habit.endedAt?.toISOString() ?? null,
    deleted_at: habit.deletedAt?.toISOString() ?? null,
    categories: JSON.stringify(habit.categories),
    user_id: habit.userId,
    rule: habit.rule,
  };
  return validateDbHabit(dbHabit);
};
