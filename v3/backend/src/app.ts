import { Hono } from "hono";
import { cors } from "hono/cors";
import { streaks } from "./data/streaks";
import { habits } from "./data/habits";
import type { ID } from "./types";

const app = new Hono();

app.use("/*", cors());

app.get("/v1/habits", async (c) => {
  const user = { id: "1" };
  const today = new Date();
  const userHabits = habits.filter((habit) => {
    const { endedAt, userId } = habit;
    return (!endedAt || endedAt > today) && userId === user.id;
  });

  const habitsWithStreaks = userHabits.map((habit) => {
    return {
      ...habit,
      streak: {
        id: crypto.randomUUID(),
        habitId: habit.id,
        streakCount: 0,
        updatedAt: new Date(),
      },
    };
  });
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return c.json({
    data: habitsWithStreaks,
  });
});

app.post("/v1/habits", async (c) => {
  const user = { id: "1" };
  const dataFromFrontend = await c.req.json<{ title: string }>();

  const created = {
    id: crypto.randomUUID(),
    title: dataFromFrontend.title,
    createdAt: new Date(),
    categories: [],
    endedAt: null,
    userId: user.id,
  };

  habits.push(created);
  streaks.set(created.id, {
    id: crypto.randomUUID(),
    habitId: created.id,
    streakCount: 0,
    updatedAt: new Date(),
  });

  return c.json(created, 201);
});

app.delete("/v1/habits/:id", (c) => {
  const id = c.req.param("id");
  const index = habits.findIndex((h) => h.id === id);

  if (index === -1) {
    return c.json(undefined, 404);
  }

  habits.splice(index, 1);
  streaks.delete(id as ID);
  return c.json(undefined, 204);
});

app.get("/v1/streaks", async (c) => {
  //await new Promise((resolve) => setTimeout(resolve, 1000));
  return c.json({
    data: Array.from(streaks.values()),
  });
});

app.patch("/v1/habits/:id/streaks", async (c) => {
  const id = c.req.param("id") as ID;
  const streak = streaks.get(id);
  if (!streak) return c.json(undefined, 404);
  const updatedStreak = {
    ...streak,
    streakCount: streak.streakCount + 1,
    updatedAt: new Date(),
  };
  streaks.set(id, updatedStreak);
  return c.json(updatedStreak);
});

export default app;
