import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  status: z.enum(["progress", "completed", "pending"]),
  user_id: z.coerce.string(),
});

export type Task = z.infer<typeof taskSchema>;
