import { useEffect, useState } from "react";
import Streaks from "./Streaks";
import Welcome from "./Welcome";
import Habits from "./Habits";
import type { Action, Habit as HabitType, Streak as StreakType } from "./types";
import { ofetch } from "ofetch";
import habitsApi from "./features/habits/services/api";

const user = {
  name: "Alfred",
  age: 20,
};

function App() {
  const [streaks, setStreaks] = useState<StreakType[]>([]);
  const [habits, setHabits] = useState<HabitType[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.time("fetching");
        console.log("fetching data");
        const habitPromise = habitsApi.list();
        const streakPromise = ofetch<{ data: StreakType[] }>(
          "http://localhost:3002/streaks"
        );
        const [habits, streaks] = await Promise.all([
          habitPromise,
          streakPromise,
        ]);
        console.log("data fetched", habits, streaks);
        setHabits(habits.data ?? []);
        setStreaks(streaks.data ?? []);
        console.log("data initialized");
        console.timeEnd("fetching");
      } catch (error) {
        console.error(error);
      }
    };

    initializeData();
  }, []);

  const add = (habit: HabitType) => {
    setHabits((prev) => [...prev, habit]);
    setStreaks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), habitId: habit.id, streakCount: 0 },
    ]);
  };

  const remove = (id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    setStreaks((prev) => prev.filter((streak) => streak.habitId !== id));
  };

  const handleHabitMutation = (action: Action, habit: HabitType) => {
    switch (action) {
      case "add":
        add(habit);
        break;
      case "remove":
        remove(habit.id);
        break;
      default:
        break;
    }
  };

  const updateStreakCountServer = async (id: string) => {
    try {
      return ofetch(`http://localhost:3002/habits/${id}/streaks`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updateStreakCount = async (id: string) => {
    const updatedStreak = await updateStreakCountServer(id);

    if (!updatedStreak) return;

    setStreaks((prevStreaks) =>
      prevStreaks.map((streak) => {
        if (updatedStreak.habitId === streak.habitId) {
          return updatedStreak;
        }
        return streak;
      })
    );
  };

  const calculateTotalStreaks = () => {
    let total = 0;
    for (const streak of streaks) {
      total += streak.streakCount;
    }
    return total;
  };

  return (
    <main>
      <Welcome user={user} />
      <Streaks
        streaks={streaks}
        updateStreakCount={updateStreakCount}
        total={calculateTotalStreaks()}
      />
      <Habits habits={habits} handleHabitMutation={handleHabitMutation} />
    </main>
  );
}

export default App;
