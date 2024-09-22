import { useCallback, useState } from "react";
import habitsApi from "../services/api";

import type { Habit } from "../types";
import { useEffectOnce } from "./useEffectOnce";

type Status = "idle" | "loading" | "error" | "success" | "fetching";

export function useHabits() {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<Habit[]>([]);

  const [error, setError] = useState<string | null>(null);

  const isFetching = status === "fetching";
  const isLoading = status === "loading" || isFetching;
  const isError = status === "error" || !!error;
  const isIdle = status === "idle";
  const isSuccess = status === "success";

  const resetToIdle = useCallback(
    (timeout = 2000) =>
      setTimeout(() => {
        setStatus("idle");
      }, timeout),
    []
  );

  const fetchData = useCallback(async () => {
    try {
      setStatus("loading");
      const result = await habitsApi.listStreaks();

      setData(result?.data ?? []);

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError("Feilet ved henting av data");
    } finally {
      resetToIdle();
    }
  }, [resetToIdle]);

  useEffectOnce(fetchData);

  const add = async (data: Partial<Habit>) => {
    const { title = "" } = data;

    try {
      setStatus("loading");
      await habitsApi.create({ title });
      await fetchData();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError("Failed creating habit");
    } finally {
      resetToIdle();
    }
  };

  const remove = async (id: string) => {
    try {
      setStatus("loading");
      await habitsApi.remove(id);
      await fetchData();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError("Failed removing item");
    } finally {
      resetToIdle();
    }
  };

  const update = async (id: string, data: Partial<Habit>) => {
    try {
      setStatus("loading");
      await habitsApi.update(id, data);
      await fetchData();
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError("Failed updating habit");
    } finally {
      resetToIdle();
    }
  };

  return {
    add,
    remove,
    update,
    get: fetchData,
    data,
    error,
    status: {
      idle: isIdle,
      loading: isLoading,
      success: isSuccess,
      error: isError,
      fetching: isFetching,
    },
  };
}

export default useHabits;
