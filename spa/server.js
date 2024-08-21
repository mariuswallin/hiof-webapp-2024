// Importerer nødvendige moduler
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";

// Oppretter en ny Hono-applikasjon
const app = new Hono();

// Aktiverer CORS (Cross-Origin Resource Sharing) for alle ruter
app.use("/*", cors());

// Setter opp statisk filbetjening for filer i "static" mappen
app.use("/static/*", serveStatic({ root: "./" }));

// Initialiserer en liste med vaner (habits)
const habits = [
  {
    id: crypto.randomUUID(),
    title: "Game",
    createdAt: new Date("2024-01-01"),
  },
];

// Definerer en POST-rute for å legge til nye vaner
app.post("/add", async (c) => {
  const newHabit = await c.req.json();
  console.log(newHabit);
  // Legger til den nye vanen i listen med en unik ID og tidsstempel
  habits.push({ id: crypto.randomUUID(), createdAt: new Date(), ...newHabit });

  // Returnerer den oppdaterte listen med vaner og en 201 (Created) statuskode
  return c.json(habits, { status: 201 });
});

// Definerer en GET-rute for å hente alle vaner
app.get("/", (c) => {
  return c.json(habits);
});

// Definerer porten serveren skal lytte på
const port = 3999;

console.log(`Server is running on port ${port}`);

// Starter serveren
serve({
  fetch: app.fetch,
  port,
});
