import type { PropsWithChildren } from "react";
import type { Streak as StreakType } from "../types";
import { formatDistance } from "../helpers/format";

export default function Streak(props: Readonly<PropsWithChildren<StreakType>>) {
  const { children, note, habitId, updatedAt } = props;
  const formatedStreak = formatDistance(new Date(updatedAt));

  return (
    <li className="flex justify-between flex-row-reverse mt-8 streak">
      {children}
      <p>
        HabitId: {habitId}. {note} Oppdatert <span>{formatedStreak}</span>
      </p>
    </li>
  );
}
