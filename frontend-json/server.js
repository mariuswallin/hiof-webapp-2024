// Importerer nødvendige moduler
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from 'node:fs/promises'



// Oppretter en ny Hono-applikasjon
const app = new Hono();

// Aktiverer CORS (Cross-Origin Resource Sharing) for alle ruter
app.use("/*", cors());

// Setter opp statisk filbetjening for filer i "static" mappen
app.use("/public/*", serveStatic({ root: "./" }));

// Initialiserer en liste med vaner (habits)
const habits = [
  {
    id: crypto.randomUUID(),
    title: "Game",
    createdAt: new Date("2024-01-01"),
  },
];


// Definerer en GET-rute for å hente alle vaner
app.get("/", (c) => {
  return c.json(habits);
});

app.get("/json", async (c) => {
  const data = await fs.readFile('./public/data.json', 'utf8')
  const dataAsJson = JSON.parse(data)
  return c.json(dataAsJson);
});

// Definerer porten serveren skal lytte på
const port = 3999;

console.log(`Server is running on port ${port}`);

// Starter serveren
serve({
  fetch: app.fetch,
  port,
});
