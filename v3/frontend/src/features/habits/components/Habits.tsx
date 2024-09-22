import type { PropsWithChildren } from "react";

import HabitForm from "./HabitForm";
import type { Action, Habit } from "../types";

type HabitsProps = {
  handleHabitMutation: (action: Action, habit: Partial<Habit>) => void;
  habits: Habit[];
  renderStreak: (habit: Habit) => React.ReactElement | null;
};

export default function Habits(
  props: Readonly<PropsWithChildren<HabitsProps>>
) {
  const { habits = [], handleHabitMutation, renderStreak, children } = props;

  const addHabit = async (title: string) => {
    handleHabitMutation("add", { title });
  };

  const removeHabit = (id: string) => {
    handleHabitMutation("remove", { id });
  };

  return (
    <>
      <section className="list">
        <h3 className="mb-4">Oversikt over vaner</h3>
        {children}
        <ul>
          {habits.length === 0 ? (
            <li>Du har ingen vaner</li>
          ) : (
            habits.map((habit) => (
              <li key={habit.id} className="habit-card">
                <header>
                  <h4>{habit.title}</h4>
                  <button
                    onClick={() => removeHabit(habit.id)}
                    type="button"
                    className="error"
                  >
                    [-]
                  </button>
                </header>
                {renderStreak(habit)}
              </li>
            ))
          )}
        </ul>
      </section>
      <HabitForm addHabit={addHabit} />
    </>
  );
}
