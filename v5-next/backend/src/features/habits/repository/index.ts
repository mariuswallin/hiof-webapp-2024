import { db, type DB } from "@/db/db";
import type { Habit, DbHabit } from "../types";

import { fromDb, toDb } from "../mappers";
import type { Result } from "@/types";
import { ResultHandler } from "@/lib/result";
import { buildQuery, parsePaginationParams } from "../utils/filter";

export const createHabitRepository = (db: DB) => {
  const exist = async (id: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM habits WHERE id = ?"
    );
    const data = query.get(id) as { count: number };
    return data.count > 0;
  };

  const getById = async (
    id: string,
    userId: string
  ): Promise<Result<Habit>> => {
    try {
      const habit = await exist(id);
      if (!habit) return ResultHandler.failure("Habit not found", "NOT_FOUND");
      const query = db.prepare(
        "SELECT * FROM habits WHERE id = ? AND user_id = ?"
      );
      const data = query.get(id, userId) as DbHabit;
      // ? Zod validate as habit
      return ResultHandler.success(fromDb(data));
    } catch (error) {
      return ResultHandler.failure(error, "INTERNAL_SERVER_ERROR");
    }
  };

  const list = async (): Promise<Result<Habit[]>> => {
    try {
      const query = db.prepare("SELECT * FROM habits");

      const data = query.all() as DbHabit[];
      return ResultHandler.success(data.map((habit) => fromDb(habit)));
    } catch (error) {
      return ResultHandler.failure(error, "INTERNAL_SERVER_ERROR");
    }
  };

  const listByUser = async (
    userId: string,
    queryParams?: Record<string, string>
  ): Promise<Result<Habit[]>> => {
    console.log(queryParams);
    try {
      const { query: q, filters } = buildQuery(
        ["title", "categories", "published"],
        queryParams,
        "SELECT * FROM HABITS WHERE user_id = ?"
      );

      const pagination = parsePaginationParams(queryParams);

      const query = db.prepare(q);
      const data = query.all(userId) as DbHabit[];
      const habits = data.map((habit) => fromDb(habit));

      if (pagination) {
        const { page, pageSize, offset } = pagination;

        const countQuery = buildQuery(
          ["*"],
          filters,
          "SELECT COUNT(*) as total from HABITS WHERE user_id = ?"
        );

        const { total } = db.prepare(countQuery.query).get(userId) as {
          total: number;
        };

        const totalPages = Math.ceil(total / pageSize);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return ResultHandler.success(habits, {
          page,
          offset,
          pages: totalPages,
          hasNextPage,
          hasPreviousPage,
        });
      }

      return ResultHandler.success(habits);
    } catch (error) {
      return ResultHandler.failure(error, "INTERNAL_SERVER_ERROR");
    }
  };

  const create = async (data: Habit): Promise<Result<string>> => {
    try {
      const habit = toDb(data);

      const query = db.prepare(`
        INSERT INTO habits (id, title, categories, user_id, rule, created_at, ended_at, deleted_at, published_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      query.run(
        habit.id,
        habit.title,
        habit.categories,
        habit.user_id,
        habit.rule,
        habit.created_at,
        habit.ended_at,
        habit.deleted_at,
        habit.published_at,
        habit.updated_at
      );
      return ResultHandler.success(habit.id);
    } catch (error) {
      return ResultHandler.failure(error, "INTERNAL_SERVER_ERROR");
    }
  };

  const update = async (data: Habit): Promise<Result<Partial<Habit>>> => {
    try {
      const habitExist = await exist(data.id);

      if (!habitExist)
        return ResultHandler.failure("Habit not found", "NOT_FOUND");

      const habit = toDb(data);

      const query = db.prepare(`
        UPDATE habits
        SET title = ?, categories = ?, rule = ?, ended_at = ?, deleted_at = ?, published_at = ?, updated_at = ?
        WHERE id = ?
      `);

      query.run(
        habit.title,
        habit.categories,
        habit.rule,
        habit.ended_at,
        habit.deleted_at,
        habit.published_at,
        habit.updated_at,
        habit.id
      );
      return ResultHandler.success(data);
    } catch (error) {
      return ResultHandler.failure(error, "INTERNAL_SERVER_ERROR");
    }
  };

  const remove = async (
    id: string,
    userId: string
  ): Promise<Result<string>> => {
    try {
      const habit = await exist(id);
      if (!habit) return ResultHandler.failure("Habit not found", "NOT_FOUND");
      const query = db.prepare(
        "DELETE FROM habits WHERE id = ? AND user_id = ?"
      );
      query.run(id, userId);
      return ResultHandler.success(id);
    } catch (error) {
      return ResultHandler.failure(error, "INTERNAL_SERVER_ERROR");
    }
  };

  return { create, list, getById, update, listByUser, remove };
};

export const habitRepository = createHabitRepository(db);

export type HabitRepository = ReturnType<typeof createHabitRepository>;
