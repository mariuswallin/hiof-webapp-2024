import type { Result } from "@/types";
import { taskRepository, type TaskRepository } from "./tasks.repository";
import type { Task } from "./tasks.schema";

export type TaskService = {
  list: () => Promise<Result<Task[]>>;
  update: (id: string, data: Pick<Task, "status">) => Promise<Result<string>>;
  get: (id: string) => Promise<Result<Task>>;
};

export const createService = (repository: TaskRepository): TaskService => {
  return {
    list: () => repository.list(),
    get: (id) => repository.get(id),
    update: (id, data) => repository.update(id, data),
  };
};

export const taskService = createService(taskRepository);
