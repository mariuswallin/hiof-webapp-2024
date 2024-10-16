import type { Student, StudentFromDb, StudentResponse } from "./student.schema";

const createId = () => {
  return crypto.randomUUID();
};

export const createStudentResponse = (student: Student): StudentResponse => {
  const { name } = student;
  const [firstName, ...rest] = name.split(" ");

  return {
    ...student,
    firstName,
    lastName: rest?.at(-1) ?? "",
    avatar: name[0],
  };
};

export const fromDb = (student: StudentFromDb) => {
  return {
    id: student.id,
    name: student.name,
    createdAt: new Date(student.created_at).toISOString(),
    updatedAt: new Date(student.updated_at).toISOString(),
  };
};

export const createStudent = (student: Partial<Student>): Student => {
  return {
    id: student.id ?? createId(),
    name: student.name ?? "",
    createdAt: student?.createdAt ?? new Date().toISOString(),
    updatedAt: student?.updatedAt ?? new Date().toISOString(),
  };
};

export const toDb = (data: Partial<Student>) => {
  const student = createStudent(data);

  return {
    id: student.id,
    name: student.name,
    created_at: student.createdAt,
    updated_at: student.updatedAt,
  };
};
