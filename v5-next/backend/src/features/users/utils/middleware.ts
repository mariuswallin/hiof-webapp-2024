import type { Context, MiddlewareHandler } from "hono";

import { getUser } from "./auth";
import { HTTPException } from "hono/http-exception";
import type { User } from "../types";
import type { HonoEnv } from "@/app";

export const authenticate = (): MiddlewareHandler => {
  return async function authenticate(c: Context<HonoEnv>, next) {
    const user = await getUser(c.req.raw, c.get("services").db);

    if (!user) throw new HTTPException(401);

    c.set("user", user);
    await next();
  };
};
