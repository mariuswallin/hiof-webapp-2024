import type { Result } from "@/types";
import {
  studentRepository,
  type StudentRepository,
} from "./student.repository";

import {
  validateCreateStudent,
  type CreateStudent,
  type Student,
  type StudentResponse,
  type UpdateStudent,
} from "./student.schema";

import { createStudent, createStudentResponse } from "./student.mapper";

export const createStudentService = (studentRepository: StudentRepository) => {
  const getById = async (id: string): Promise<Result<Student | undefined>> => {
    return studentRepository.getById(id);
  };

  const list = async (
    query?: Record<string, string>
  ): Promise<Result<StudentResponse[]>> => {
    const students = await studentRepository.list(query);
    if (!students.success) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to list students",
        },
      };
    }

    return { success: true, data: students.data.map(createStudentResponse) };
  };

  const create = async (data: CreateStudent): Promise<Result<string>> => {
    const student = createStudent(data);

    if (!validateCreateStudent(student).success) {
      return {
        success: false,
        error: { code: "BAD_REQUEST", message: "Invalid student data" },
      };
    }
    return studentRepository.create(student);
  };

  const update = async (data: UpdateStudent) => {
    const student = createStudent(data);

    if (!validateCreateStudent(student).success) {
      return {
        success: false,
        error: { code: "BAD_REQUEST", message: "Invalid student data" },
      };
    }

    return studentRepository.update(student);
  };

  const remove = async (id: string) => {
    return studentRepository.remove(id);
  };

  return {
    list,
    create,
    update,
    getById,
    remove,
  };
};

export const studentService = createStudentService(studentRepository);

export type StudentService = ReturnType<typeof createStudentService>;
