import { Hono } from "hono";
import { cors } from "hono/cors";
import { streaks } from "./data/streaks";
import { habits } from "./data/habits";
import type { ID } from "./types";

import { authenticate } from "./features/users/utils/middleware";
import type { User } from "./features/users/types";

type ContextVariables = {
  user: User | null;
};

const app = new Hono<{ Variables: ContextVariables }>();

app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Legger til authenticate som skal trigges før
// async (c) => handleren knyttet til `/v1/habits`
app.get("/v1/habits", authenticate(), async (c) => {
  // Bytter ut getUser med middleware
  // const user = getUser(c.req.raw);
  // Bruker contexten
  const user = c.get("user");

  const today = new Date();
  const userHabits = habits.filter((habit) => {
    const { endedAt, userId } = habit;
    return (!endedAt || endedAt > today) && userId === user?.id;
  });

  // await new Promise((resolve) => setTimeout(resolve, 3000));
  return c.json({
    data: userHabits,
  });
});

app.post("/v1/habits", async (c) => {
  const user = { id: "1" };
  const dataFromFrontend = await c.req.json<{ title: string }>();

  const id = crypto.randomUUID();
  const created = {
    id,
    title: dataFromFrontend.title,
    createdAt: new Date(),
    categories: [],
    endedAt: null,
    userId: user.id,
    streak: {
      id: crypto.randomUUID(),
      habitId: id,
      streakCount: 0,
      updatedAt: new Date(),
    },
  };

  habits.push(created);

  // Sletter denne
  // streaks.set(created.id, {
  //   id: crypto.randomUUID(),
  //   habitId: created.id,
  //   streakCount: 0,
  //   updatedAt: new Date(),
  // });

  return c.json(created, 201);
});

app.delete("/v1/habits/:id", (c) => {
  const id = c.req.param("id");
  const index = habits.findIndex((h) => h.id === id);

  if (index === -1) {
    return c.json(undefined, 404);
  }

  habits.splice(index, 1);
  // streaks.delete(id as ID);
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
  const habit = habits.find((h) => h.id === id);
  const streak = habit?.streak;

  if (!streak) return c.json(undefined, 404);

  const updatedStreak = {
    ...streak,
    streakCount: streak.streakCount + 1,
    updatedAt: new Date(),
  };

  habit.streak = updatedStreak;

  return c.json(updatedStreak);
});

export default app;
