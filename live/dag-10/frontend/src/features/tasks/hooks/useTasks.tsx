"use client";

import { useCallback, useState } from "react";
import type { Task } from "../schema";
import { URLS } from "@/config";

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTasks = useCallback(async (): Promise<Task[] | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${URLS.tasks}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error);
        return result;
      }

      setTasks(result.data);
      return result.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunne ikke hente oppgavene"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTask = useCallback(async (id: string): Promise<Task | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${URLS.tasks}/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error);
        return result;
      }

      setTasks([result.data]);
      return result.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunne ikke hente oppgaven"
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    getTasks,
    getTask,
    loading,
    error,
  };
};
