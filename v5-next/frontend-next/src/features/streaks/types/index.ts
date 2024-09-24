import type { z } from "zod";
import type { streakSchema } from "../helpers/schema";

// export type Streak = {
//   id: string;
//   habitId: string;
//   streakCount: number;
//   updatedAt: Date;
// };

export type Streak = z.infer<typeof streakSchema>;
