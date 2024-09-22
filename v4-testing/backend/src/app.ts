import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";

import type { User } from "@/features/users/types";
import { type DB, db } from "@/db/db";
import { makeLogger, type Logger } from "./lib/logger";
import { type ServerEnv, env } from "@/lib/env";
import { handleError } from "@/lib/error";
import { habitController } from "@/features/habits/controller";
import { streakController } from "./features/streaks/controller";

type ContextVariables = {
  user: User | null;
};

export type ServiceContext = {
  db: DB;
  logger: Logger;
};

export type HonoEnv = {
  Bindings: ServerEnv;
  Variables: {
    services: ServiceContext;
  } & ContextVariables;
};

export const makeApp = (
  database: DB = db,
  logger: Logger = makeLogger({ logLevel: env.LOG_LEVEL, env: env.NODE_ENV })
) => {
  const app = new Hono<HonoEnv>();
  app.use(
    "/*",
    cors({
      origin: `${env.FRONTEND_URL}`,
      credentials: true,
    })
  );
  app.use(prettyJSON());
  app.use("*", async (c, next) => {
    c.set("services", {
      logger,
      db: database,
    });

    await next();
  });

  app.route("/v1/habits", habitController);
  app.route("/v1/streaks", streakController);

  app.onError(handleError);

  return app;
};

const app = makeApp();

export default app;
