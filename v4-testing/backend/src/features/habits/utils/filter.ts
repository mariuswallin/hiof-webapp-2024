const isValidField = (fields: readonly string[], field: string) => {
  if (fields.includes("*")) return true;
  return fields.includes(field);
};

const parseNumber = (value?: string | number): number | undefined => {
  if (!value) return undefined;
  if (typeof value === "number") return value;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const parsePaginationParams = (queryParams?: Record<string, string>) => {
  if (!queryParams?.page_size && !queryParams?.page) return;

  const pageSize = parseNumber(queryParams.page_size) ?? 10;
  const page = parseNumber(queryParams.page) ?? 1;

  return {
    page,
    pageSize,
    offset: (page - 1) * pageSize,
  };
};

const isBooleanValue = (value: string): boolean => {
  return value === "true" || value === "false";
};

const addFieldSelection = (
  filters: Record<string, string>,
  fields: readonly string[],
  baseQuery: string
): string => {
  const filterFields = (filters?.limit?.split(",") ?? []).filter((field) =>
    isValidField(fields, field)
  );

  return filterFields.length === 0
    ? baseQuery
    : baseQuery.replace("*", filterFields.join(", "));
};

const sanitizeValue = (value: string): string => {
  return value.replace(/[^a-z_]/gi, "");
};

const addFilters = (
  filters: Record<string, string>,
  baseQuery: string
): string => {
  let query = "";

  for (const entry of Object.entries(filters)) {
    if (!entry) continue;

    const [key, value] = entry;

    if (!value) continue;

    switch (key) {
      case "categories":
        query += ` AND ${key} LIKE '%${sanitizeValue(value)}%'`;
        break;
      case "published": {
        if (!isBooleanValue(value)) continue;
        if (value === "true") {
          query += ` AND published_at IS NOT NULL AND published_at <= '${new Date()}'`;
          continue;
        }
        query += " AND published_at IS NULL";
        break;
      }
    }
  }

  return baseQuery.includes("WHERE")
    ? query
    : query.trim().replace(/^AND /, " WHERE ");
};

const addPagination = (filters: Record<string, string> = {}): string => {
  let query = "";

  const pagination = parsePaginationParams(filters);

  if (!pagination) return query;

  const { pageSize, offset } = pagination;

  query += ` LIMIT ${pageSize}`;
  query += ` OFFSET ${offset}`;

  return query;
};

const addSorting = (
  fields: string[],
  filters: Record<string, string>
): string => {
  if (!filters.sort) return "";

  let [field, direction] = filters.sort.split(",").map((value) => value.trim());

  if (!isValidField(fields, field)) return "";

  direction = ["asc", "desc"].includes(direction?.toLowerCase())
    ? direction
    : "asc";

  return ` ORDER BY ${field} ${direction.toUpperCase()}`;
};

function getFilters(fields: string[], query: Record<string, string>) {
  return Object.entries(query).reduce((acc, [key, value]) => {
    if (value !== null && isValidField(fields, key)) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, string>);
}

export function buildQuery(
  fields: string[],
  queryParams: Record<string, string> | undefined,
  baseQuery = "SELECT * FROM HABITS"
): { query: string; filters?: Record<string, string> } {
  if (!queryParams || Object.keys(queryParams).length === 0)
    return { query: baseQuery };

  const filters = getFilters(fields, queryParams);

  let query = addFieldSelection(queryParams, fields, baseQuery);

  query += addFilters(filters, baseQuery);

  if (fields.includes("*")) return { query: query.trim(), filters };

  query += addSorting(fields, queryParams);
  query += addPagination(queryParams);

  return { query: query.trim(), filters };
}
