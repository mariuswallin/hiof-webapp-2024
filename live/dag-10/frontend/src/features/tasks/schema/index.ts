import { z } from "zod";

export const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Tittel må være fylt ut"),
  status: z.enum(["progress", "completed", "pending"]),
});

export type Task = z.infer<typeof taskSchema>;
