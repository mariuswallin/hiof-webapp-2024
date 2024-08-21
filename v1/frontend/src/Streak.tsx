import type { PropsWithChildren } from "react";
import type { Streak as StreakType } from "./types";

export default function Streak(props: Readonly<PropsWithChildren<StreakType>>) {
  const { children, streakCount, habitId } = props;

  return (
    <section>
      {children}
      <p>
        HabitId: {habitId}. HabitStreak {streakCount}
      </p>
    </section>
  );
}
