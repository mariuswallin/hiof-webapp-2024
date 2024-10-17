import { Hono } from "hono";
import { cors } from "hono/cors";
import { isNameValid } from "./lib/validators";

const app = new Hono();

app.use("/*", cors());

let students = [
  { id: "1", name: "Ola Normann" },
  { id: "2", name: "Kari Normann" },
];

/*
fetch('https://server-url/api/students, {method: 'GET'})
*/

app.get("/api/students", (c) => {
  return c.json(students);
});

/*
fetch('https://server-url/api/students/${id}, {method: 'GET'})
*/

app.get("/api/students/:id", (c) => {
  const id = c.req.param("id");
  const student = students.filter((student) => student.id === id);
  return c.json(student);
}); /*
fetch('https://server-url/api/students, {method: 'POST', body: JSON.stringify(data)})
*/

app.post("/api/students", async (c) => {
  const data = await c.req.json();
  const { name } = data;
  if (!isNameValid(name))
    return c.json({ success: false, error: "Invalid name" }, { status: 400 });

  students.push({ id: crypto.randomUUID(), name });
  return c.json({ success: true, data: students }, { status: 201 });
});

/*
fetch('https://server-url/api/students/${id}, {method: 'DELETE'})
*/

/*
const handleDelete = async (id: string) => {
  const response =  await fetch('https://server-url/api/students/${id}, {method: 'DELETE'})
  const result = await response.json()
  //const students = await getStudentsFromApi()
  setStudentList(result.data)
}
*/

app.delete("/api/students/:id", (c) => {
  const id = c.req.param("id");
  students = students.filter((student) => student.id !== id);
  return c.json({ data: students });
});

/*
fetch('https://server-url/api/students/${id}, {method: 'PATCH', body: JSON.stringify(data)})
*/

app.patch("/api/students/:id", async (c) => {
  const id = c.req.param("id");
  const { name } = await c.req.json();
  students = students.map((student) =>
    student.id === id ? { ...student, name } : student
  );
  return c.json(students);
});

app.onError((err, c) => {
  console.error(err);

  return c.json(
    {
      error: {
        message: err.message,
      },
    },
    { status: 500 }
  );
});

export default app;
