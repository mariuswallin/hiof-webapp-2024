import { useState } from "react";
import Streaks from "./Streaks";
import Welcome from "./Welcome";
import Habits from "./Habits";
import type { Action, Habit as HabitType, Streak as StreakType } from "./types";
import { ofetch } from "ofetch";

const user = {
  name: "Alfred",
  age: 20,
};

function App() {
  const [streaks, setStreaks] = useState<StreakType[]>([]);
  const [habits, setHabits] = useState<HabitType[]>([]);

  ofetch("http://localhost:3000/habits").then((res) => {
    console.log("data fetched", res);
  });

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

  const updateStreakCount = (id: string) => {
    setStreaks((prevStreaks) =>
      prevStreaks.map((streak) => {
        if (streak.id === id) {
          return { ...streak, streakCount: streak.streakCount + 1 };
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
