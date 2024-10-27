"use client";

import { useState } from "react";
import type { Task } from "../schema";
import { URLS } from "@/config";

export const useTaskUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTask = async (
    id: string,
    data: { status: Pick<Task, "status"> }
  ): Promise<Task | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${URLS.tasks}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error);
        return result;
      }

      return result.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Kunne ikke oppdatere oppgaven"
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateTask,
    loading,
    error,
  };
};
