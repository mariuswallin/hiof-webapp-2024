import Link from "next/link";
import type { Task as TaskType } from "../schema";

export function Task({
  task,
  onUpdateTask,
}: {
  task: TaskType;
  onUpdateTask?: (task: TaskType) => void;
}) {
  return (
    <section className="border border-dotted px-4 py-4 rounded-lg">
      {onUpdateTask ? (
        <div className="my-4">
          <select
            value={task?.status ?? "pending"}
            onChange={(e) => onUpdateTask(e.target.value as TaskType["status"])}
            className="border rounded px-2 py-1 text-black"
          >
            <option value="pending" disabled>
              Pending
            </option>
            <option value="progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      ) : (
        <Link href={`/tasks/${task?.id}`} className="underline">
          Gå til task
        </Link>
      )}
      <h1 className="mb-2 text-lg font-bold">Task komponent</h1>
      <p>{task?.title}</p>
      <p>{task?.status}</p>
    </section>
  );
}

export default Task;
