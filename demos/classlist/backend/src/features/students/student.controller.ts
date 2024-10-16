import { Hono } from "hono";
import { studentService, type StudentService } from "./student.service";
import { errorResponse, type ErrorCode } from "@/lib/error";

export const createStudentController = (studentService: StudentService) => {
  const app = new Hono();

  app.get("/", async (c) => {
    const query = c.req.query();

    const result = await studentService.list(query);

    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await studentService.getById(id);

    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.post("/", async (c) => {
    const data = await c.req.json();
    const result = await studentService.create(data);
    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result, { status: 201 });
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();

    const result = await studentService.update({ id, ...data });
    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  app.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await studentService.remove(id);
    if (!result.success)
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    return c.json(result);
  });

  return app;
};

export const studentController = createStudentController(studentService);
