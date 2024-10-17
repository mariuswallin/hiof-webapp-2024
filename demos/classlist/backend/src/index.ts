import { serve } from "@hono/node-server";
import { Hono, type Context } from "hono";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
import { studentController } from "./features/students/student.controller";
import { HTTPException } from "hono/http-exception";

const app = new Hono();
app.use("*", cors());

let students = [
  { id: "1", name: "Ola Normann" },
  { id: "2", name: "Kari Normann" },
];

app.get("/api/students", (c) => {
  return c.json(students);
});

app.post("/api/students", async (c) => {
  const { name } = await c.req.json();
  if (!name || name.length < 5)
    return c.json({
      success: false,
      error: "Name must be at least 5 characters long",
      status: 400,
    });
  students.push({ id: crypto.randomUUID(), name });
  return c.json({ data: students, success: true, status: 201 });
});

app.delete(
  "/api/students/:id",
  bearerAuth({
    verifyToken: async (token, c) => {
      const value = Buffer.from(token, "base64").toString("utf-8");
      return value.split(":").length === 2;
    },
    invalidTokenMessage: {
      success: false,
      error: "Invalid token",
    },
    noAuthenticationHeaderMessage: {
      success: false,
      error: "Missing token",
    },
  }),
  async (c) => {
    const id = c.req.param("id");
    const studentExist = students.some((student) => student.id === id);
    if (!studentExist) {
      return c.json({
        error: "Student not found",
        status: 404,
        success: false,
      });
    }
    students = students.filter((student) => student.id !== id);
    return c.json({ data: students, success: true });
  }
);

app.patch("/api/students/:id", async (c) => {
  const id = c.req.param("id");
  const { name } = await c.req.json();
  students = students.map((student) =>
    student.id === id ? { ...student, name } : student
  );
  return c.json(students);
});

app.post("/api/auth/login", async (c) => {
  const { username, password } = await c.req.json();
  const hash = Buffer.from(`${username}:${password}`).toString("base64");
  return c.json(hash);
});

app.route("/v1/students", studentController);

app.onError(async (err: Error, c: Context) => {
  // Errors ikke håndtert andre steder
  console.log(err);
  if (err instanceof HTTPException) {
    const message = await err.res?.json();
    return c.json(
      {
        error: {
          message: message?.error ?? err.message ?? "Noe gikk galt",
        },
      },
      { status: err.status }
    );
  }

  return c.json(
    {
      error: {
        message: err.message,
      },
    },
    { status: 500 }
  );
});

const port = 3999;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
