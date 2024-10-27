import { Hono } from "hono";

import { taskService, type TaskService } from "./tasks.service";

export const createController = (taskService: TaskService) => {
  const app = new Hono();

  app.get("/", async (c) => {
    const result = await taskService.list();

    if (!result.success)
      // Håndtere ulike feil her (f.eks. 400)
      return c.json(result, { status: 500 });
    return c.json(result);
  });

  app.get("/:id", async (c) => {
    const id = c.req.param("id");
    const result = await taskService.get(id);

    if (!result.success)
      // Håndtere ulike feil her (f.eks. 400)
      return c.json(result, { status: 500 });

    return c.json(result);
  });

  app.patch("/:id", async (c) => {
    const id = c.req.param("id");
    const data = await c.req.json();

    const result = await taskService.update(id, data);
    if (!result.success)
      // Håndtere ulike feil her (f.eks. 400)
      return c.json(result, { status: 500 });
    return c.json(result, { status: 200 });
  });
  return app;
};

export const tasksController = createController(taskService);
