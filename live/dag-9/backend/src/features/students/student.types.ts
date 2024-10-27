import { z } from "zod";

export const studentsSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const studentsSchemaDB = z.object({
  id: z.string(),
  name: z.string().min(3),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Student = z.infer<typeof studentsSchema>;
export type StudentDB = z.infer<typeof studentsSchemaDB>;

export const validateStudent = (data: unknown) => {
  return studentsSchema.safeParse(data);
};
