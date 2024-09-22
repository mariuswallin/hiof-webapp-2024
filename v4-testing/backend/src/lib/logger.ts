import pino from "pino";

type ApplicationConfig = {
  env: "development" | "production" | "test";
  logLevel: "debug" | "info" | "warn" | "error";
};

type LogMethod = (message: { [key: string]: unknown } | string) => void;

export interface Logger {
  debug: LogMethod;
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  fatal: LogMethod;
}

export function makeLogger(config?: ApplicationConfig): Logger {
  const env = config?.env ?? "development";
  return pino({
    level: config?.logLevel ?? "info",
    enabled: env !== "test",
  });
}
