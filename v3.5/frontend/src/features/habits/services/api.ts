import { ofetch } from "ofetch";

import { endpoints } from "@/config/urls";
import { validateHabit } from "../helpers/schema";
import type { Habit } from "../types";

const url = endpoints.habits;

const remove = async (id: string) => {
  try {
    await ofetch(`${url}/${id}`, {
      method: "DELETE",
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
    });
    // console.log(habitsSchema.safeParse(habits.data));
    return validateHabit(habits.data);
  } catch (error) {
    console.error(error);
  }
};

export default { remove, create, list };
