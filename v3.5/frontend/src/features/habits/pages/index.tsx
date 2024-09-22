import { ofetch } from "ofetch";

import Habits from "../components/Habits";

import Streak from "@/features/streaks/components/Streak";
import StreakTotal from "@/features/streaks/components/StreakTotal";
import useHabits from "../hooks/useHabits";
import type { Action, Habit } from "../types";

export default function HabitPage() {
  const { add, remove, status, get, data, error } = useHabits();
  // const { streaks = [], habits = [] } = data;
  const habits = data;

  const handleHabitMutation = (action: Action, data: Partial<Habit>) => {
    const { id, ...habit } = data;

    switch (action) {
      case "add":
        add(habit);
        break;
      case "remove":
        remove(id);
        break;
      default:
        break;
    }
  };

  const updateStreakCountServer = async (id: string) => {
    try {
      return ofetch(`http://localhost:3000/v1/habits/${id}/streaks`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateStreakCount = async (id: string) => {
    const updatedStreak = await updateStreakCountServer(id);

    if (!updatedStreak) return;

    await get();
  };

  const calculateTotalStreaks = () => {
    let total = 0;
    // for (const streak of streaks) {
    //   total += streak.streakCount;
    // }
    for (const habit of habits) {
      total += habit?.streak?.streakCount ?? 0;
    }
    return total;
  };

  if (status.loading) return <p>Laster ...</p>;
  if (status.error) return <p className="error">{error}</p>;

  return (
    <Habits
      habits={habits}
      handleHabitMutation={handleHabitMutation}
      renderStreak={(habit) => {
        // const streak = streaks.find((s) => s.habitId === habit.id);
        const streak = habit.streak;
        if (!streak) return null;

        return (
          <Streak {...streak}>
            <button
              type="button"
              // onClick={() => updateStreakCount(streak.habitId)}
              onClick={() => updateStreakCount(habit.id)}
            >
              Oppdater streak
            </button>
          </Streak>
        );
      }}
    >
      <StreakTotal
        streakCount={habits.length}
        // streakCount={streaks.length}
        totalStreak={calculateTotalStreaks()}
      />
      {/* <pre>{JSON.stringify(status)}</pre> */}
    </Habits>
  );
}
