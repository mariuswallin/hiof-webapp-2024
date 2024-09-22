import "dotenv/config";

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export type ServerEnv = typeof env;

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    FRONTEND_URL: z.coerce.string(),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().endsWith(".db"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
