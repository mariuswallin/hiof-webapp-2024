import { db, type DB } from "@/db/db";
import type {
  CreateStudent,
  Student,
  StudentFromDb,
  UpdateStudent,
} from "./student.schema";
import type { Result } from "@/types";
import { fromDb, toDb } from "./student.mapper";
import type { Query } from "@/lib/query";

export const createStudentRepository = (db: DB) => {
  const exist = async (id: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM students WHERE id = ?"
    );
    const data = query.get(id) as { count: number };
    return data.count > 0;
  };

  const getById = async (id: string): Promise<Result<Student>> => {
    try {
      const student = await exist(id);
      if (!student)
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Student not found" },
        };
      const query = db.prepare("SELECT * FROM students WHERE id = ?");
      const data = query.get(id) as StudentFromDb;
      return {
        success: true,
        data: fromDb(data),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med henting av student",
        },
      };
    }
  };

  const list = async (params?: Query): Promise<Result<Student[]>> => {
    try {
      const { name, pageSize = 10, page = 0 } = params ?? {};

      const offset = (Number(page) - 1) * Number(pageSize);

      const hasPagination = Number(page) > 0;

      let query = "SELECT * FROM students";
      query += name ? `WHERE name LIKE '%${name}%'` : "";
      query += pageSize ? ` LIMIT ${pageSize}` : "";
      query += offset ? ` OFFSET ${offset}` : "";

      const statement = db.prepare(query);

      const data = statement.all() as StudentFromDb[];

      const { total } = db
        .prepare("SELECT COUNT(*) as total from students")
        .get() as {
        total: number;
      };

      const totalPages = Math.ceil(total / Number(pageSize ?? 1));
      const hasNextPage = Number(page) < totalPages;
      const hasPreviousPage = Number(page ?? 1) > 1;

      return {
        success: true,
        data: data.map(fromDb),
        ...(hasPagination
          ? {
              total: data.length,
              pageSize,
              page,
              totalPages,
              hasNextPage,
              hasPreviousPage,
            }
          : {}),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med henting av studenter",
        },
      };
    }
  };

  const create = async (data: CreateStudent): Promise<Result<string>> => {
    try {
      const student = toDb(data);

      const query = db.prepare(`
        INSERT INTO students (id, name, created_at, updated_at)
        VALUES (?, ?, ?, ?)
      `);

      query.run(
        student.id,
        student.name,
        student.created_at,
        student.updated_at
      );
      return {
        success: true,
        data: student.id,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med oppretting av student",
        },
      };
    }
  };

  const update = async (data: UpdateStudent): Promise<Result<Student>> => {
    try {
      const studentExist = await exist(data.id);

      if (!studentExist)
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Student not found" },
        };

      const student = toDb(data);

      const query = db.prepare(`
        UPDATE students
        SET name = ?, updated_at = ?
        WHERE id = ?
      `);

      query.run(student.name, student.updated_at, student.id);
      return {
        success: true,
        data: fromDb(student),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med oppdatering av student",
        },
      };
    }
  };

  const remove = async (id: string): Promise<Result<string>> => {
    try {
      const student = await exist(id);
      if (!student)
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Student not found" },
        };
      const query = db.prepare("DELETE FROM students WHERE id = ?");
      query.run(id);
      return {
        success: true,
        data: id,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med sletting av student",
        },
      };
    }
  };

  return { create, list, getById, update, remove };
};

export const studentRepository = createStudentRepository(db);

export type StudentRepository = ReturnType<typeof createStudentRepository>;
