import { Hono } from "hono";
import { studentService, type StudentService } from "./student.service";

// Lager en controller som tar inn en studentService og returnerer et Hono-objekt
export const createStudentController = (studentService: StudentService) => {
  // Lager en ny instans av Hono slik at vi kan lage en controller og bruke
  // Hono sin router der vi setter opp alle routes
  const app = new Hono();

  // Setter opp en route for GET
  app.get("/", async (c) => {
    const query = c.req.query();

    // Kaller studentService sin list funksjon og sender med query
    const result = await studentService.list(query);

    if (!result.success)
      // Håndtere feil her (f.eks. 500)
      return c.json(result);
  });

  // Setter opp en route for POST
  app.post("/", async (c) => {
    // Henter ut data fra requesten
    const data = await c.req.json();
    // Kaller studentService sin create funksjon og sender med data
    const result = await studentService.create(data);
    if (!result.success)
      // Håndtere feil her (f.eks. 400)
      return c.json(result, { status: 201 });
  });
  return app;
};

// Lager en instans av studentController med studentService som parameter
export const studentController = createStudentController(studentService);
