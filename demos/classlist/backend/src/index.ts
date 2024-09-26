import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

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
  const student = await c.req.json();
  students.push(student);
  return c.json(students);
});

app.delete("/api/students/:id", async (c) => {
  const id = c.req.param("id");
  students = students.filter((student) => student.id !== id);
  return c.json(students);
});

app.patch("/api/students/:id", async (c) => {
  const id = c.req.param("id");
  const { name } = await c.req.json();
  students = students.map((student) =>
    student.id === id ? { ...student, name } : student
  );
  return c.json(students);
});

const port = 3999;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
