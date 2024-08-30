import { z } from "zod";

// Definerer et Zod-skjema for Habit
export const HabitSchema = z.object({
  id: z.string(),
  title: z.string(),
  // z.coerce.date(); // new Date(input) => Zod parser verdien og sjekker om den er date
  createdAt: z.coerce.date(),
});

// Definerer et Zod-skjema for å opprette en ny Habit
export const HabitCreateSchema = HabitSchema.omit({ id: true });

// Definerer et Zod-skjema for en array av Habit
export const HabitArraySchema = z.array(HabitSchema);

// Oppdatert type-definisjon basert på Zod-skjemaet
export type Habit = z.infer<typeof HabitSchema>;

// Oppdatert type-definisjon basert på Zod-skjemaet
export type CreateHabit = z.infer<typeof HabitCreateSchema>;
