import type { PropsWithChildren } from "react";
import type { Streak as StreakType } from "../types";
import { formatDistance } from "../helpers/format";

export default function Streak(props: Readonly<PropsWithChildren<StreakType>>) {
  const { children, streakCount, habitId, updatedAt } = props;
  const formatedStreak = formatDistance(updatedAt);

  return (
    <section className="flex justify-between flex-row-reverse mt-8">
      {children}
      <p>
        HabitId: {habitId}. HabitStreak {streakCount}. Oppdatert{" "}
        <span>{formatedStreak}</span>
      </p>
    </section>
  );
}
