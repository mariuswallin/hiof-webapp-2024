import type { Result } from "@/types";

import type { Task } from "./tasks.schema";
import { db, type DB } from "@/db/db";

export type TaskRepository = {
  list: () => Promise<Result<Task[]>>;
  get: (id: string) => Promise<Result<Task>>;
  update: (id: string, data: Pick<Task, "status">) => Promise<Result<string>>;
};

export const createRepository = (db: DB): TaskRepository => {
  const list = async (): Promise<Result<Task[]>> => {
    try {
      const statement = db.prepare(`SELECT * from tasks`);
      const data = statement.all() as Task[];

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed getting tasks",
        },
      };
    }
  };

  const get = async (id: string): Promise<Result<Task>> => {
    try {
      const statement = db.prepare(`SELECT * from tasks where id = ?`);
      const data = statement.get(id) as Task;

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed getting task",
        },
      };
    }
  };

  const update = async (
    id: string,
    data: Pick<Task, "status">
  ): Promise<Result<string>> => {
    try {
      const query = db.prepare(`
        UPDATE tasks
        SET status = ?
        WHERE id = ?
      `);

      const result = query.run(data.status, id);

      return {
        success: true,
        data: `${result.lastInsertRowid}`,
      };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed updating task",
        },
      };
    }
  };

  return {
    list,
    get,
    update,
  };
};

export const taskRepository = createRepository(db);
