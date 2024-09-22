import { ofetch } from "ofetch";

import { endpoints } from "@/config/urls";
import { validateHabit } from "../helpers/schema";
import type { Habit } from "../types";
import type { Streak } from "@/features/streaks/types";

const url = endpoints.habits;

const remove = async (id: string) => {
  try {
    await ofetch(`${url}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const create = async (data: Pick<Habit, "title">) => {
  try {
    const createdHabit = await ofetch(url, {
      method: "POST",
      body: data,
      credentials: "include",
    });

    return createdHabit;
  } catch (error) {
    console.error(error);
  }
};

const list = async () => {
  try {
    const habits = await ofetch(url, {
      credentials: "include",
      //retry: 0,
    });
    // console.log(habitsSchema.safeParse(habits.data));
    return validateHabit(habits.data);
  } catch (error) {
    console.error(error);
  }
};

const listStreaks = async (): Promise<{
  data: (Habit & { streaks: Streak[] })[];
}> => {
  try {
    const habitData = await ofetch(url, {
      credentials: "include",
      //retry: 0,
    });
    const habits = validateHabit(habitData.data);

    if (!habits.success) return { data: [] };
    const data = await Promise.all(
      habits.data.map((habit) =>
        ofetch(`${url}/${habit.id}/streaks`, {
          credentials: "include",
          //retry: 0,
        }).then(({ data }) => data)
      )
    );
    return { data };
  } catch (error) {
    console.error(error);
    return { data: [] };
  }
};

const update = async (id: string, data: Partial<Habit>) => {
  try {
    await ofetch(`${url}/${id}`, {
      method: "PATCH",
      body: data,
      credentials: "include",
    });
  } catch (error) {
    console.error(error);
  }
};

export default { remove, create, list, update, listStreaks };
