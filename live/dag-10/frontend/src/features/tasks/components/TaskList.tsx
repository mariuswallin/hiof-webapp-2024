"use client";

import type { Task as TaskType } from "../schema";
import Task from "./Task";

export function TaskList({ tasks }: { tasks: TaskType[] }) {
  return (
    <section className="w-full max-w-xl mx-auto">
      <h1 className="mb-5 font-bold text-xl">TaskList komponent</h1>
      <section className="grid grid-cols-3 gap-4 w-full">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </section>
    </section>
  );
}
