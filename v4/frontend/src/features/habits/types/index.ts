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
  update: "update",
} as const;

export type HandleMutationProps =
  | {
      action: typeof actions.remove;
      id: string;
    }
  | {
      action: typeof actions.update;
      id: string;
      habit: Partial<Habit>;
    }
  | {
      action: typeof actions.add;
      habit: Partial<Habit>;
    };

export type HandleMutation = (props: HandleMutationProps) => void;

export type Action = typeof actions;

export type Habit = z.infer<typeof habitSchema>;
