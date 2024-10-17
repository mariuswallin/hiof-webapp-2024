import type { Result } from "@/types";

// Lager typen for studentRepository som sikrer at vi har de riktige funksjonene i createStudentRepository
type StudentRepository = {
  // Bruker Result typen for å sikre konsistent error handling / returnering
  list: (query?: Record<string, string>) => Promise<Result<string[]>>;
  create: (data: Record<string, string>) => Promise<Result<string>>;
};

// Lager en funksjon som lager en studentRepository
export const createStudentRepository = (db: unknown): StudentRepository => {
  return {
    list: () => {},
    create: () => {},
  };
};

// Eksporterer studentRepository som en instans av createStudentRepository
// For å sikre at vi ikke må importere DB etc andre steder i koden
export const studentRepository = createStudentRepository({});
