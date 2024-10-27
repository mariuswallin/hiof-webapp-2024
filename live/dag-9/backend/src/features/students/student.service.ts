import type { Result } from "@/types";
import {
  studentRepository,
  type StudentRepository,
} from "./student.repository";
import type { Student, StudentDB } from "./student.types";

export type StudentService = {
  list: (query: Record<string, string>) => Promise<Result<StudentDB[]>>;
  create: (data: Student) => Promise<Result<Student>>;
};

// Lager en funksjon som tar inn et studentRepository og returnerer et objekt med to funksjoner: list og create
export const createStudentService = (
  repository: StudentRepository
): StudentService => {
  // Returnerer funksjon for list og create
  // Funksjonene forwarder bare kallet til repository (da vi ikke har noe business logikk her)
  return {
    list: async (query) => {
      return repository.list(query);
    },
    create: async (data) => {
      return repository.create(data);
    },
  };
};

// Lager en instans av studentService med studentRepository som parameter
// Unngår å importere studentRepository i andre filer
export const studentService = createStudentService(studentRepository);
