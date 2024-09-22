import type { z } from "zod";
import type { habitSchema } from "../helpers/schema";

// export type Habit = {
//   id: string;
//   title: string;
//   createdAt: string;
//   categories: string[];
//   userId: string;
//   endedAt: string | null;
// };

export const actions = {
  add: "add",
  remove: "remove",
};

export type Action = (typeof actions)[keyof typeof actions];

export type Habit = z.infer<typeof habitSchema>;
