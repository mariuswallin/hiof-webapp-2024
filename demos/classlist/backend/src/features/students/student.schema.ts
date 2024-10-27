import { z } from "zod";

export const studentsSchema = z.object({
  id: z.string(),
  name: z.string().min(3),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const studentResponseSchema = studentsSchema.extend({
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string(),
});

export const updateStudentSchema = studentsSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const createStudentSchema = studentsSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type Student = z.infer<typeof studentsSchema>;

export const studentFromDbSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type StudentFromDb = z.infer<typeof studentFromDbSchema>;
export type CreateStudent = z.infer<typeof createStudentSchema>;
export type UpdateStudent = z.infer<typeof updateStudentSchema>;
export type StudentResponse = z.infer<typeof studentResponseSchema>;

export const validateCreateStudent = (data: unknown) => {
  return createStudentSchema.safeParse(data);
};

export const validateUpdateStudent = (data: unknown) => {
  return updateStudentSchema.safeParse(data);
};

export const validateStudent = (data: unknown) => {
  return studentsSchema.safeParse(data);
};
