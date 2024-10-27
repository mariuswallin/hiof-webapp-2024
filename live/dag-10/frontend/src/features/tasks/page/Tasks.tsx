"use client";

import { TaskList } from "../components/TaskList";
import { useTasks } from "../hooks/useTasks";
import { useEffect } from "react";

export function TasksPage() {
  const { tasks, getTasks, loading, error } = useTasks();

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  if (loading) return <div>Laster oppgaver...</div>;
  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  return (
    <section>
      <h1>Tasks siden</h1>
      <TaskList tasks={tasks} />
    </section>
  );
}
