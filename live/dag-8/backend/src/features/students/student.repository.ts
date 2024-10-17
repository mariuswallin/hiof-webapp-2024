import type { Result } from "@/types";

type StudentRepository = {
  list: (query?: Record<string, string>) => Promise<Result<string[]>>;
  create: (data: Record<string, string>) => Promise<Result<string>>;
};

export const createStudentRepository = (db: unknown): StudentRepository => {
  return {
    list: () => {},
    create: () => {},
  };
};

export const studentRepository = createStudentRepository({});
