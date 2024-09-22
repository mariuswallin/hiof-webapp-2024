// habitIntegration.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setupTestEnvironment, cleanTestDb } from "./setup";

import { makeApp, type HonoEnv } from "@/app";
import type { Hono } from "hono";

describe("Habit Integration Tests", () => {
  let env: ReturnType<typeof setupTestEnvironment>;
  let app: Hono<HonoEnv>;
  const auth: RequestInit = {
    headers: new Headers({
      "Content-Type": "application/json",
      Cookie: "user.id=user1",
    }),
    credentials: "include",
  };

  beforeEach(() => {
    env = setupTestEnvironment();
    app = makeApp(env.db, {
      info: vi.fn(),
      debug: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      fatal: vi.fn(),
    });

    // TODO: Inject controllers or use different routes for testing
    app.route("/habits", env.habitController);
  });

  afterEach(() => {
    cleanTestDb(env.db);
    env.db.close();
  });

  describe("GET /habits", () => {
    it("should return habits for the authenticated user", async () => {
      const res = await app.request("/habits", auth);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.length).toBe(2);
      expect(body.data[0].title).toBe("Morning Jog");
      expect(body.data[1].title).toBe("Read a Book");
    });

    it("should return only published habits when queried", async () => {
      const res = await app.request("/habits?published=true", auth);
      expect(res.status).toBe(200);

      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.length).toBe(1);
      expect(body.data[0].title).toBe("Morning Jog");
    });
  });

  describe("GET /habits/:id", () => {
    it("should return a specific habit", async () => {
      const res = await app.request("/habits/1", auth);
      expect(res.status).toBe(200);

      const body = await res.json();

      expect(body.success).toBe(true);
      expect(body.data.id).toBe("1");
      expect(body.data.title).toBe("Morning Jog");
    });

    it("should return 404 for non-existent habit", async () => {
      const res = await app.request("/habits/999", auth);
      expect(res.status).toBe(404);
    });
  });

  describe("POST /habits", () => {
    it("should create a new habit", async () => {
      const newHabit = {
        title: "New Habit",
        rule: "daily",
      };
      const res = await app.request("/habits", {
        method: "POST",
        headers: auth.headers,
        body: JSON.stringify(newHabit),
        credentials: "include",
      });

      expect(res.status).toBe(201);
      const body = await res.json();
      expect(body.success).toBe(true);

      const checkRes = await app.request(`/habits/${body.data}`, auth);
      const checkBody = await checkRes.json();

      expect(checkBody.data.title).toBe("New Habit");
    });
  });

  describe("PATCH /habits/:id", () => {
    it("should update an existing habit", async () => {
      const updateData = {
        title: "Updated Habit",
      };

      const res = await app.request("/habits/2", {
        method: "PATCH",
        headers: auth.headers,
        body: JSON.stringify(updateData),
        credentials: "include",
      });

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.title).toBe("Updated Habit");

      const checkRes = await app.request("/habits/2", auth);
      const checkBody = await checkRes.json();
      expect(checkBody.data.title).toBe("Updated Habit");
    });
  });

  describe("DELETE /habits/:id", () => {
    it("should delete an existing habit", async () => {
      const res = await app.request("/habits/2", {
        method: "DELETE",
        ...auth,
      });

      expect(res.status).toBe(200);

      const checkRes = await app.request("/habits/2", auth);
      expect(checkRes.status).toBe(404);
    });
  });
});
