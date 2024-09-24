import type { HonoEnv } from "@/app";
import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import { z, type ZodError } from "zod";

const Errors = z.enum([
  "BAD_REQUEST",
  "FORBIDDEN",
  "INTERNAL_SERVER_ERROR",
  "NOT_FOUND",
  "NOT_UNIQUE",
  "RATE_LIMITED",
  "UNAUTHORIZED",
  "METHOD_NOT_ALLOWED",
]);

export type ErrorCode = z.infer<typeof Errors>;

function codeToStatus(code: ErrorCode): StatusCode {
  switch (code) {
    case "BAD_REQUEST":
      return 400;
    case "FORBIDDEN":
    case "UNAUTHORIZED":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "METHOD_NOT_ALLOWED":
      return 405;
    case "NOT_UNIQUE":
      return 409;
    case "RATE_LIMITED":
      return 429;
    case "INTERNAL_SERVER_ERROR":
      return 500;
  }
}

function statusToCode(status: StatusCode): ErrorCode {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 405:
      return "METHOD_NOT_ALLOWED";
    case 500:
      return "INTERNAL_SERVER_ERROR";
    default:
      return "INTERNAL_SERVER_ERROR";
  }
}

export class ApiError extends HTTPException {
  public readonly code: ErrorCode;

  constructor({ code, message }: { code: ErrorCode; message: string }) {
    super(codeToStatus(code), { message });
    this.code = code;
  }
}

export function parseZodErrorMessage(err: z.ZodError): string {
  try {
    const arr = JSON.parse(err.message) as Array<{
      message: string;
      path: Array<string>;
    }>;
    const { path, message } = arr[0];
    return `${path.join(".")}: ${message}`;
  } catch {
    return err.message;
  }
}

export function handleZodError(
  result:
    | {
        success: true;
        data: unknown;
      }
    | {
        success: false;
        error: ZodError;
      },
  c: Context
) {
  if (!result.success) {
    return c.json(
      {
        error: {
          code: "BAD_REQUEST",
          message: parseZodErrorMessage(result.error),
        },
      },
      { status: 400 }
    );
  }
}

export const handleError = async (err: Error, c: Context<HonoEnv>) => {
  const { logger } = c.get("services");

  if (err instanceof ApiError) {
    if (err.status >= 500) {
      logger.error({
        [err.message]: {
          name: err.name,
          code: err.code,
          status: err.status,
        },
      });
    }
    return c.json(
      {
        error: {
          code: err.code,
          message: err.message,
        },
      },
      { status: err.status }
    );
  }

  if (err instanceof HTTPException) {
    if (err.status >= 500) {
      logger.error({
        HTTPException: {
          message: err.message,
          status: err.status,
        },
      });
    }

    const code = statusToCode(err.status);

    return c.json(
      {
        error: {
          code,
          message: err.message,
        },
      },
      { status: err.status }
    );
  }

  logger.error({
    "unhandled exception": {
      name: err.name,
      message: err.message,
      cause: err.cause,
      stack: err.stack,
    },
  });

  return c.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: err.message ?? "Something went wrong",
      },
    },
    { status: 500 }
  );
};

export function errorResponse(c: Context, code: ErrorCode, message: string) {
  return c.json(
    {
      error: {
        code,
        message,
      },
    },
    { status: codeToStatus(code) }
  );
}
