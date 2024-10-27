import type { Result } from "@/types";
import type { Student, StudentDB } from "./student.types";
import { db, type DB } from "@/db/db";

// Lager typen for studentRepository som sikrer at vi har de riktige funksjonene i createStudentRepository
export type StudentRepository = {
  // Bruker Result typen for å sikre konsistent error handling / returnering
  list: (query?: Record<string, string>) => Promise<Result<StudentDB[]>>;
  create: (data: Student) => Promise<Result<Student>>;
};

// Lager en funksjon som lager et studentRepository
// Tar i mot en db som parameter for å kunne bruke db funksjoner (og for å kunne mocke db i tester)
export const createStudentRepository = (db: DB): StudentRepository => {
  // Lager funksjonen list som henter ut alle studenter fra databasen
  // Tar i mot en query som parameter for å kunne filtrere studenter
  const list = async (
    query?: Record<string, string>
  ): Promise<Result<StudentDB[]>> => {
    try {
      // Lager en SQL statement som henter ut alle studenter
      const statement = db.prepare(`SELECT * from students`);
      // Kjører statementen og henter ut alle studentene
      const data = statement.all() as StudentDB[];

      // Sikrer konsekvent error handling / returnering
      return {
        success: true,
        data,
      };
    } catch (error) {
      // Sikrer konsekvent error handling / returnering
      // Code her kan være hva som helst, den nå uansett håndteres i controller
      // for å gi en god respons til klienten
      return {
        success: false,
        error: {
          code: "SOME_CODE_HERE",
          message: "Failed getting students",
        },
      };
    }
  };

  // Lager funksjonen create som lager en student i databasen
  const create = async (data: Student): Promise<Result<Student>> => {
    try {
      // Lager et objekt som inneholder dataen vi skal legge til i databasen
      // Passer på riktig format for databasen
      // Bør optimalt sett være en "mapper" funksjon som gjør dette
      const studentToDb = {
        id: data.id ?? crypto.randomUUID(),
        name: data.name,
        created_at: data.createdAt ?? new Date().toISOString(), // Fallback til nå om vi ikke har verdi
        updated_at: data.updatedAt ?? new Date().toISOString(), // Fallback til nå om vi ikke har verdi
      };

      // Lager en SQL statement som legger til en student
      const query = db.prepare(`
      INSERT INTO students (id, name, created_at, updated_at) 
      VALUES (?, ?, ?, ?)
      `);

      // Kjører statementen med dataen vi lagde tidligere
      // Denne gir oss antall rader som blir modifisert
      const result = query.run(
        studentToDb.id,
        studentToDb.name,
        studentToDb.created_at,
        studentToDb.updated_at
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed creating student",
        },
      };
    }
  };

  return {
    list,
    create,
  };
};

// Eksporterer studentRepository som en instans av createStudentRepository
// For å sikre at vi ikke må importere DB etc andre steder i koden
export const studentRepository = createStudentRepository(db);
