import { streakSchema } from "@/features/streaks/helpers/schema";
import { z } from "zod";

export { habitSchema, habitsSchema };

const habitSchema = z
  .object({
    id: z.string().uuid(),
    title: z.string(),
    categories: z.array(z.string()),
    userId: z.string(),
    createdAt: z.string().datetime(),
    endedAt: z.nullable(z.string().datetime()),
  })
  .extend({ streak: streakSchema })
  .optional();

const habitsSchema = z.array(habitSchema);

export function validateHabit(data: unknown) {
  return habitSchema.safeParse(data);
}
