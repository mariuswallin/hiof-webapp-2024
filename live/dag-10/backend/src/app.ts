import { Hono } from "hono";
import { cors } from "hono/cors";

import { tasksController } from "@/features/tasks/tasks.controller";

const app = new Hono();

app.use("/*", cors());

app.route("/api/tasks", tasksController);

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
