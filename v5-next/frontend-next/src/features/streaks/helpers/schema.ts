import { z } from "zod";

export { streakSchema, streaksSchema };

const streakSchema = z.object({
  id: z.string().uuid(),
  habitId: z.string().uuid(),
  note: z.string().optional(),
  updatedAt: z.string().datetime(),
});

const streaksSchema = z.array(streakSchema);

export function validateStreak(data: unknown) {
  return streakSchema.safeParse(data);
}
