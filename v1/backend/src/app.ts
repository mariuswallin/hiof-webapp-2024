import { Hono } from "hono";
import { cors } from "hono/cors";
import { streaks } from "./data/streaks";
import { habits } from "./data/habits";
import type { ID } from "./types";

const app = new Hono();

app.use("/*", cors());

app.get("/habits", async (c) => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return c.json({
    data: habits,
  });
});

app.post("/habits", async (c) => {
  const dataFromFrontend = await c.req.json<{ title: string }>();

  const created = {
    id: crypto.randomUUID(),
    title: dataFromFrontend.title,
    createdAt: new Date(),
    categories: [],
  };

  habits.push(created);
  streaks.set(created.id, {
    id: crypto.randomUUID(),
    habitId: created.id,
    streakCount: 0,
  });

  return c.json(created, 201);
});

app.delete("/habits/:id", (c) => {
  const id = c.req.param("id") as ID;
  const index = habits.findIndex((h) => h.id === id);

  if (index === -1) {
    return c.json(undefined, 404);
  }

  habits.splice(index, 1);
  streaks.delete(id);
  return c.json(undefined, 204);
});

app.get("/streaks", async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return c.json({
    data: Array.from(streaks.values()),
  });
});

app.patch("/habits/:id/streaks", async (c) => {
  const id = c.req.param("id") as ID;
  const streak = streaks.get(id);
  if (!streak) return c.json(undefined, 404);
  const updatedStreak = { ...streak, streakCount: streak.streakCount + 1 };
  streaks.set(id, updatedStreak);
  return c.json(updatedStreak);
});

export default app;
