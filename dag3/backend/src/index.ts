import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Weather } from "./types";
import { getParsedData, updateWeatherData } from "./lib";

const app = new Hono();

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", async (c) => {
  const data = await getParsedData();
  return c.json({ data });
});

app.get("/:place", async (c) => {
  const reqPlace = c.req.param("place");
  const data = await getParsedData();
  if (!reqPlace) return c.json({ error: "Missing place" }, 400);
  const existing = data.find(
    (place) => place.place.toLowerCase() === reqPlace.toLowerCase()
  );
  if (!existing) return c.json({ error: "Place not found" }, 404);
  return c.json({ data: existing });
});

app.post("/", async (c) => {
  const body = await c.req.json<Weather>();
  if (!body.place) return c.json({ error: "Missing place" }, 400);
  const data = await getParsedData();
  const hasPlace = data.some(
    (place) => place.place.toLowerCase() === body.place.toLowerCase()
  );
  if (hasPlace) return c.json({ error: "Place already exists" }, 409);
  data.push(body);
  await updateWeatherData(data);
  return c.json({ data }, 201);
});

app.delete("/:place", async (c) => {
  const reqPlace = c.req.param("place");
  const data = await getParsedData();
  if (!reqPlace) return c.json({ error: "Missing place" }, 400);
  const existing = data.find(
    (place) => place.place.toLowerCase() === reqPlace.toLowerCase()
  );
  if (!existing) return c.json({ error: "Place not found" }, 404);

  if (existing.deleted) return c.json({ error: "Place already deleted" }, 409);
  const newData = data.map((weather) => {
    if (weather.place === reqPlace) {
      return { ...weather, deleted: true };
    }
    return weather;
  });
  await updateWeatherData(newData);
  return c.json({ data: newData });
});

const port = 3999;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
