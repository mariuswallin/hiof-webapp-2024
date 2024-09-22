import { ofetch } from "ofetch";

import Habits from "../components/Habits";

import Streak from "@/features/streaks/components/Streak";
import StreakTotal from "@/features/streaks/components/StreakTotal";
import useHabits from "../hooks/useHabits";
import type { Habit, HandleMutation } from "../types";

export default function HabitPage() {
  const { add, remove, update, status, get, data, error } = useHabits();
  const habits = data;

  const handleHabitMutation: HandleMutation = (props) => {
    const { action } = props;

    switch (action) {
      case "add":
        add(props.habit);
        break;
      case "remove":
        remove(props.id);
        break;
      case "update":
        update(props.id, props.habit);
        break;
      default:
        break;
    }
  };

  const addStreakServer = async (id: string) => {
    try {
      return ofetch("http://localhost:3999/v1/streaks", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          note: "",
          habitId: id,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const addStreak = async (id: string) => {
    const updatedStreak = await addStreakServer(id);

    if (!updatedStreak) return;

    await get();
  };

  const calculateTotalStreaks = () => {
    let total = 0;

    for (const habit of habits) {
      total += habit?.streaks?.length ?? 0;
    }
    return total;
  };

  if (status.loading) return <p>Laster ...</p>;
  if (status.error) return <p className="error">{error}</p>;

  return (
    <>
      <Habits
        habits={habits}
        handleHabitMutation={handleHabitMutation}
        renderStreak={(habit) => {
          const streaks = habit.streaks;

          return (
            <>
              <ul>
                {streaks?.map((streak) => (
                  <Streak key={streak.id} {...streak} />
                ))}
              </ul>
              <button
                type="button"
                className="mt-4"
                onClick={() => addStreak(habit.id)}
              >
                Legg til streak
              </button>
            </>
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
    </>
  );
}
