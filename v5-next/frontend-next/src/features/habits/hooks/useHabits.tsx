"use client";

import { useCallback, useState } from "react";
import habitsApi from "../services/api";

import type { Habit, Pagination } from "../types";
import { useEffectOnce } from "./useEffectOnce";
import { useSearchParams } from "next/navigation";

type Status = "idle" | "loading" | "error" | "success" | "fetching";

type UseHabitsProps = {
	initialHabits: Habit[];
	initialFetch?: boolean;
	initialPagination: Pagination | null;
};

export function useHabits({
	initialPagination = null,
	initialFetch = true,
	initialHabits = [],
}: UseHabitsProps) {
	const [data, setData] = useState<Habit[]>(initialHabits);
	const [status, setStatus] = useState<Status>("idle");
	const [pagination, setPagination] = useState<Pagination | null>(
		initialPagination ? initialPagination : null,
	);
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
		[],
	);

	const fetchData = useCallback(
		async (
			filters: { title?: string; page?: string; page_size?: string } = {},
		) => {
			try {
				setStatus("loading");
				const result = await habitsApi.listStreaks(filters);
				setData(result?.data ?? []);
				if (result.pagination) setPagination(result.pagination);

				setStatus("success");
			} catch (error) {
				setStatus("error");
				setError("Feilet ved henting av data");
			} finally {
				resetToIdle();
			}
		},
		[resetToIdle],
	);

	useEffectOnce(() => {
		if (!initialFetch) return;
		fetchData();
	});

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
		pagination,
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
