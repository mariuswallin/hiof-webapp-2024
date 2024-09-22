import type { ErrorCode } from "@/lib/error";

export type ID = ReturnType<typeof crypto.randomUUID>;

export type Paginated = {
  offset: number;
  page: number;
  pages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type Data<T> = {
  success: true;
  data: T;
  pagination?: Paginated;
};

type Err = {
  code: ErrorCode;
  message: string;
};

export type Error = {
  success: false;
  error: Err;
};

export type Result<T> = Data<T> | Error;

export type ResultFn = {
  success: <T>(data: T, pagination?: Paginated) => Data<T>;
  failure: (error: unknown, code: ErrorCode) => Error;
};

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
