import fs from "node:fs/promises";
import { join } from "node:path";
import type { DB } from "./db";
import type { Student } from "../features/students/student.schema";

export const seed = async (db: DB) => {
  const path = join(import.meta.dirname, "data.json");
  const file = await fs.readFile(path, "utf-8");
  const { students } = JSON.parse(file) as {
    students: Student[];
  };

  const insertStudent = db.prepare(`
  INSERT INTO students (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)
`);

  db.transaction(() => {
    for (const student of students) {
      insertStudent.run(
        student.id,
        student.name,
        student.createdAt,
        student.updatedAt
      );
    }
  })();
};
