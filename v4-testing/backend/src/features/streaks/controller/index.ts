import { Hono } from "hono";
import { streakService } from "../service";
import { errorResponse } from "@/lib/error";

import type { HonoEnv } from "@/app";
import type { Data } from "@/types";

import type { StreakService } from "../types";

export const createStreakController = (streakService: StreakService) => {
  const app = new Hono<HonoEnv>();

  app.post("/", async (c) => {
    const data = await c.req.json();
    const result = await streakService.addStreakToHabit(
      data.habitId,
      data.note
    );
    if (!result.success)
      return errorResponse(c, result.error.code, result.error.message);
    return c.json<Data<string>>(result, { status: 201 });
  });

  return app;
};

export const streakController = createStreakController(streakService);
