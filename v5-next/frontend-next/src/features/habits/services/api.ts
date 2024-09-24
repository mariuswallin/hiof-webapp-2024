import { ofetch } from "ofetch";

import { endpoints } from "@/config/urls";
import { validateHabits, validateHabit } from "../helpers/schema";
import type { Habit, Pagination } from "../types";
import type { Streak } from "@/features/streaks/types";

const url = endpoints.habits;

export const makeClient = (
  options: { headers?: RequestInit["headers"] } = {}
) => {
  const { headers } = options;

  return ofetch.create({
    baseURL: url,
    credentials: "include",
    headers,
  });
};

export const serviceFactory = (client = makeClient()) => {
  const remove = async (id: string) => {
    try {
      await client(`${url}/${id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const create = async (data: Pick<Habit, "title">) => {
    try {
      const createdHabit = await client(url, {
        method: "POST",
        body: data,
      });

      return createdHabit;
    } catch (error) {
      console.error(error);
    }
  };

  const list = async () => {
    try {
      const habits = await client(url);
      // console.log(habitsSchema.safeParse(habits.data));
      return validateHabits(habits.data);
    } catch (error) {
      console.error(error);
    }
  };

  const listStreaks = async (
    filters: {
      title?: string;
      page?: string;
      page_size?: string;
    } = {}
  ): Promise<{
    data: (Habit & { streaks: Streak[] })[];
    pagination: Pagination | null;
  }> => {
    const { title, page, page_size } = filters;
    // Lager en ny URL med søkeparametre
    const withParams = new URL(url);
    withParams.searchParams.append("title", title ?? "");
    withParams.searchParams.append("page", page ?? "1");
    withParams.searchParams.append("page_size", page_size ?? "2");

    try {
      // Bruker server-url med søkeparametre (får denne via .href)
      // Destrukturerer data og pagination fra responsen
      const { data: habitsData, ...pagination } = await client(withParams.href);

      const habits = validateHabits(habitsData);

      if (!habits.success) return { data: [], pagination: null };
      const data = await Promise.all(
        habits.data.map((habit) =>
          client(`${url}/${habit.id}/streaks`).then(({ data }) => data)
        )
      );

      // Returnerer data og paginering
      return { data, pagination };
    } catch (error) {
      console.error(error);
      return { data: [], pagination: null };
    }
  };

  const update = async (id: string, data: Partial<Habit>) => {
    try {
      await client(`${url}/${id}`, {
        method: "PATCH",
        body: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const get = async (id: string) => {
    try {
      const habit = await client(`${url}/${id}`);
      return validateHabit(habit.data);
    } catch (error) {
      console.error(error);
    }
  };

  return { remove, create, list, update, listStreaks, get };
};

export default serviceFactory();
