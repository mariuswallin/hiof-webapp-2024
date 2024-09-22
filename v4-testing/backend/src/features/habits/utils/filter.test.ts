import { describe, expect, it } from "vitest";
import { buildQuery } from "./filter";

describe("filter", () => {
  it("returns base query when no query params are provided", () => {
    // @ts-expect-error
    const query = buildQuery(["id", "title", "description"]);
    expect(query.query).toBe("SELECT * FROM HABITS");
    expect(query.filters).toBeUndefined();
  });
  it("returns base query with selected fields (using limit)", () => {
    const query = buildQuery(["id", "title"], { limit: "id,title" });
    expect(query.query).toBe("SELECT id, title FROM HABITS");
    expect(query.filters).toEqual({});
  });
  it("filters by categories", () => {
    const query = buildQuery(["id", "title", "categories"], {
      categories: "fitness",
    });
    expect(query.query).toMatch(
      /SELECT .* FROM HABITS WHERE categories LIKE '%fitness%'/
    );
    expect(query.filters).toEqual({ categories: "fitness" });
  });
  it("filters by published: true", () => {
    const query = buildQuery(["id", "title", "published"], {
      published: "true",
    });
    expect(query.query).toMatch(
      /SELECT \* FROM HABITS WHERE published_at IS NOT NULL AND published_at/
    );
    expect(query.filters).toEqual({ published: "true" });
  });
  it("filters by published: false", () => {
    const query = buildQuery(["id", "title", "published"], {
      published: "false",
    });
    expect(query.query).toMatch(
      /SELECT \* FROM HABITS WHERE published_at IS NULL/
    );
    expect(query.filters).toEqual({ published: "false" });
  });
  it("ignores invalid filters", () => {
    const query = buildQuery(["id", "title"], { invalid_filter: "value" });
    expect(query.query).toBe("SELECT * FROM HABITS");
    expect(query.filters).toMatchObject({});
  });
  it("handles invalid filter values", () => {
    const query = buildQuery(["id", "title"], { limit: "invalid" });
    expect(query.query).toBe("SELECT * FROM HABITS");
    expect(query.filters).toMatchObject({});
  });

  it("clean values to prevent SQL-injections", () => {
    const query = buildQuery(["id", "title", "categories"], {
      categories: "fitness;DROP TABLE habits",
    });
    expect(query.query).toMatch(
      /SELECT \* FROM HABITS WHERE categories LIKE '%fitnessDROPTABLEhabits%'/
    );
    expect(query.filters).toEqual({ categories: "fitness;DROP TABLE habits" });
  });

  it("handle pagination", () => {
    const query = buildQuery(["id", "title"], { page_size: "10", page: "2" });
    expect(query.query).toMatch(/SELECT .* FROM HABITS LIMIT 10 OFFSET 10/);
  });

  it("handle sorting", () => {
    const query = buildQuery(["id", "title"], { sort: "title,DESC" });
    expect(query.query).toBe("SELECT * FROM HABITS ORDER BY title DESC");
  });

  it("handle invalid sorting", () => {
    const query = buildQuery(["id", "title"], { sort: "invalid_field,ASC" });
    expect(query.query).toBe("SELECT * FROM HABITS");
  });
  it("handle default direction", () => {
    const query = buildQuery(["id", "title"], { sort: "title" });

    expect(query.query).toBe("SELECT * FROM HABITS ORDER BY title ASC");
  });

  it("handle invalid sortingdirection", () => {
    const query = buildQuery(["id", "title"], { sort: "title,invalid" });
    expect(query.query).toBe("SELECT * FROM HABITS ORDER BY title ASC");
  });
});
