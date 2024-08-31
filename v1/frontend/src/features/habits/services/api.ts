import { ofetch } from "ofetch";
import type { Habit } from "@/types";

const baseUrl = "http://localhost:3002";
const habitsUrl = `${baseUrl}/habits`;

const remove = async (habit: Habit) => {
  try {
    await ofetch(`${habitsUrl}/${habit.id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(error);
  }
};

const create = async (data: Pick<Habit, "title">) => {
  try {
    const createdHabit = await ofetch(habitsUrl, {
      method: "POST",
      body: data,
    });

    return createdHabit ?? {};
  } catch (error) {
    console.error(error);
  }
};

const list = async () => {
  try {
    const habits = await ofetch(habitsUrl);
    return habits;
  } catch (error) {
    console.error(error);
  }
};

export default { remove, create, list };
