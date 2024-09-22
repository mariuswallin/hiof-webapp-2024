import { z } from "zod";

export { streakSchema, streaksSchema };

const streakSchema = z.object({
  id: z.string().uuid(),
  habitId: z.string().uuid(),
  streakCount: z.number(),
  updatedAt: z.string().datetime(),
});

const streaksSchema = z.array(streakSchema);

export function validateStreak(data: unknown) {
  return streakSchema.safeParse(data);
}
