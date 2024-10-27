"use client";

import { useParams, useRouter } from "next/navigation";
import { useTasks } from "../hooks/useTasks";
import { useEffect } from "react";
import { useTaskUpdate } from "../hooks/useTaskUpdate";
import Task from "../components/Task";
import type { Task as TaskType } from "../schema";

export function TaskPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { tasks, getTask, loading, error: getError } = useTasks();
  const { updateTask, error } = useTaskUpdate();

  useEffect(() => {
    getTask(id);
  }, [id, getTask]);

  const onUpdateTask = async (status: Pick<TaskType, "status">) => {
    await updateTask(id, { status });
    if (error) return;
    router.push("/tasks");
  };

  if (loading) return <div>Laster oppgave...</div>;
  if (error || getError) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <section>
      <h1>Task siden</h1>
      <Task task={tasks[0]} onUpdateTask={onUpdateTask} />
    </section>
  );
}
