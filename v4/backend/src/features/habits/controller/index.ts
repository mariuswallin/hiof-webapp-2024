import { Hono } from "hono";
import { habitService, type HabitService } from "../service";
import { errorResponse } from "@/lib/error";

import type { HonoEnv } from "@/app";
import type { Data } from "@/types";
import type { User } from "@/features/users/types";

import { authenticate } from "@/features/users/utils/middleware";

export const createHabitController = (habitService: HabitService) => {
  const app = new Hono<HonoEnv>();

  app.use(authenticate());

  app.get("/", async (c) => {
    const user = c.get("user") as User;
    const query = c.req.query();
    const result = await habitService.listByUser(user.id, query);

    if (!result.success)
      return errorResponse(c, result.error.code, result.error.message);
    return c.json(result);
  });

  app.get("/:id", async (c) => {
    const user = c.get("user") as User;
    const id = c.req.param("id");
    const result = await habitService.getById(id, user.id);
    if (!result.success)
      return errorResponse(c, result.error.code, result.error.message);
    return c.json(result);
  });

  app.get("/:id/streaks", async (c) => {
    const user = c.get("user") as User;
    const id = c.req.param("id");
    const result = await habitService.listHabitStreaks(id, user.id);
    if (!result.success)
      return errorResponse(c, result.error.code, result.error.message);
    return c.json(result);
  });

  app.post("/", async (c) => {
    const user = c.get("user") as User;
    const data = await c.req.json();
    const result = await habitService.create({
      ...data,
      userId: user.id,
    });
    if (!result.success)
      return errorResponse(c, result.error.code, result.error.message);
    return c.json<Data<string>>(result, { status: 201 });
  });

  app.patch("/:id/publish", async (c) => {
    const user = c.get("user") as User;
    const id = c.req.param("id");
    const result = await habitService.publish(id, user.id);
    if (!result.success)
      return errorResponse(c, result.error.code, result.error.message);
    return c.json(result);
  });

  app.patch("/:id", async (c) => {
    const user = c.get("user") as User;
    const id = c.req.param("id");
    const data = await c.req.json();
    const result = await habitService.update(
      {
        id,
        ...data,
      },
      user.id
    );
    if (!result.success)
      return errorResponse(c, result.error.code, result.error.message);
    return c.json(result);
  });

  app.delete("/:id", async (c) => {
    const user = c.get("user") as User;
    const id = c.req.param("id");
    const result = await habitService.remove(id, user.id);
    if (!result.success)
      return errorResponse(c, result.error.code, result.error.message);
    return c.json(result);
  });

  return app;
};

export const habitController = createHabitController(habitService);
