import { z } from "zod";

export type PaginationParams = {
  offset: string;
  pageSize: string;
  page: string;
} | null;

const querySchema = z.object({
  name: z.string().optional(),
  offset: z.string().optional(),
  pageSize: z.string().optional(),
  page: z.string().optional(),
});

export const validateQuery = (data: unknown) => {
  return querySchema.safeParse(data);
};

export type Pagination = {
  total: string;
  pageSize: string;
  page: string;
  totalPages: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
} | null;

export type Query = z.infer<typeof querySchema>;
