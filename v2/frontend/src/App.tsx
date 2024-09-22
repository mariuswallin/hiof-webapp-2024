import { useEffect, useState } from "react";
import Streaks from "./Streaks";
import Welcome from "./Welcome";
import Habits from "./Habits";
import type { Action, Habit as HabitType, Streak as StreakType } from "./types";
import { ofetch } from "ofetch";
import habitsApi from "./features/habits/services/api";
import Navigation from "./Navigation";
import Direction from "./Direction";
import Streak from "./Streak";
import StreakTotal from "./StreakTotal";
import Footer from "./Footer";

const user = {
  name: "Alfred",
  age: 20,
};

function App() {
  const [streaks, setStreaks] = useState<StreakType[]>([]);
  const [habits, setHabits] = useState<HabitType[]>([]);
  const [direction, setDirection] = useState<"vertical" | "horizontal">(
    (window.localStorage.getItem("direction") as "vertical" | "horizontal") ??
      "horizontal"
  );

  useEffect(() => {
    const initializeData = async () => {
      try {
        console.time("fetching");
        console.log("fetching data");
        const habitPromise = habitsApi.list();
        const streakPromise = ofetch<{ data: StreakType[] }>(
          "http://localhost:3000/streaks"
        );
        const [habits, streaks] = await Promise.all([
          habitPromise,
          streakPromise,
        ]);
        console.log("data fetched");
        setHabits(habits ?? []);
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

  const handleDirectionChange = (direction: "horizontal" | "vertical") => {
    setDirection(direction);
    window.localStorage.setItem("direction", direction);
  };

  const updateStreakCountServer = async (id: string) => {
    try {
      return ofetch(`http://localhost:3000/habits/${id}/streaks`, {
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
    <>
      <Navigation />
      <main className="container">
        <Welcome user={user} />
        <section className={`layout ${direction}`}>
          {/* Lagt til mulighet for å styre direction */}
          <Direction
            setDirection={handleDirectionChange}
            direction={direction}
          />
          <Habits
            habits={habits}
            handleHabitMutation={handleHabitMutation}
            renderStreak={(habit) => {
              // Henter en streak som matcher på habit
              const streak = streaks.find((s) => s.habitId === habit.id);
              // Hvis det ikke finnes en streak, returner null
              if (!streak) return null;
              // Hvis det finnes en streak, returner en Streak komponent
              // Sender nødvendige props til Streak komponenten
              return (
                <Streak {...streak}>
                  <button
                    type="button"
                    onClick={() => updateStreakCount(streak.habitId)}
                  >
                    Oppdater streak
                  </button>
                </Streak>
              );
            }}
          >
            <StreakTotal
              streakCount={streaks.length}
              totalStreak={calculateTotalStreaks()}
            />
          </Habits>

          {/* Kommentert ut da vi nå ikke trenger denne lengre */}
          {/* <Streaks
              streaks={streaks}
              updateStreakCount={updateStreakCount}
              total={calculateTotalStreaks()}
            /> */}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default App;
