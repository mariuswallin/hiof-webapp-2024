import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import { HabitSchema, type Habit } from "../types";
import { resolve } from "node:path";
import fs, { readFile } from "node:fs/promises";

const app = new Hono();

app.use("/*", cors());

// Serve statiske filer fra assets mappen
app.use("/assets/*", serveStatic({ root: "./" }));

// Serve statiske filer fra statics (som lages ved build)
app.use("/statics/*", serveStatic({ root: "./" }));

// Setter typen til habits til å være en array av Habit
const habits: Habit[] = [
  {
    id: crypto.randomUUID(),
    title: "Game",
    createdAt: new Date("2024-01-01"),
  },
];

app.get("/json", async (c) => {
  const data = await fs.readFile("./assets/data.json", "utf8");
  const dataAsJson = JSON.parse(data);
  return c.json(dataAsJson);
});

app.post("/api/add", async (c) => {
  const newHabit = await c.req.json();
  // Validerer at dataen vi mottar er en gyldig Habit
  const habit = HabitSchema.parse(newHabit);
  // Sjekker om habit er en gyldig Habit, og returnerer en feilmelding hvis ikke
  if (!habit) return c.json({ error: "Invalid habit" }, { status: 400 });
  console.log(habit);
  habits.push(habit);

  const jsonData = await readFile("./assets/data.json", "utf-8");

  const data = JSON.parse(jsonData);

  // Skriver til filen data.json
  await fs.writeFile(
    "./assets/data.json",
    // Legger til den nye habiten i listen med habits
    // Bruker JSON.stringify for å konvertere dataen til en JSON-streng
    JSON.stringify([...data, habit], null, 2)
  );

  // Returnerer en liste med alle habits. Bruker generisk type for å fortelle at vi returnerer en array av Habit
  return c.json<Habit[]>(habits, { status: 201 });
});

const htmlForm = `
  <!DOCTYPE html>
<html lang="no">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vaner</title>
  <link rel="stylesheet" href="/assets/styles.css">
</head>

<body>
  <h1>Vaner fra server HTML</h1>
  <form id="habitForm">
    <label for="title">Tittel:</label>
    <input type="text" id="title" name="title">
    <button type="submit">Legg til</button>
  </form>
  <ul id="habitsList"></ul>
  <script type="module" src="/statics/main.js"></script>
</body>

</html>
`;

app.get("/html", (c) => {
  return c.html(htmlForm);
});

app.get("/api/habits", (c) => {
  // Returnerer en liste med alle habits. Bruker generisk type for å fortelle at vi returnerer en array av Habit
  return c.json<Habit[]>(habits);
});

const port = 3999;

console.log(`Server is running on port ${port}`);

// Trenger ikke da Vite via vite.server.config.ts
// håndterer det i dette tilfelle

// serve({
//   fetch: app.fetch,
//   port,
// });

export default app;
