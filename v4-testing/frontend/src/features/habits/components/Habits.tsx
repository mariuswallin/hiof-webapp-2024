import { useState, type PropsWithChildren } from "react";

import HabitForm from "./HabitForm";
import type { Habit, HandleMutation } from "../types";

type HabitsProps = {
  handleHabitMutation: HandleMutation;
  habits: Habit[];
  renderStreak: (
    habit: Habit
  ) => React.ReactElement | React.ReactElement[] | null;
};

// TODO: Context
export default function Habits(
  props: Readonly<PropsWithChildren<HabitsProps>>
) {
  const { habits = [], handleHabitMutation, renderStreak, children } = props;

  const [editing, setEditing] = useState<Habit | undefined>(undefined);

  const editHabit = (habit: Habit) => {
    if (editing?.id === habit.id) return setEditing(undefined);
    setEditing(habit);
  };

  const onSubmit = (id: string | undefined, data: Partial<Habit>) => {
    if (id) return handleHabitMutation({ action: "update", id, habit: data });
    return handleHabitMutation({ action: "add", habit: data });
  };

  const removeHabit = (id: string) => {
    handleHabitMutation({ action: "remove", id });
  };

  return (
    <>
      <section className="list">
        <h3 className="mb-4">Oversikt over vaner</h3>
        {children}
        <ul id="habits-wrapper">
          {habits.length === 0 ? (
            <li>Du har ingen vaner</li>
          ) : (
            habits.map((habit) => (
              <li key={habit.id} className="habit-card">
                <header>
                  <h4>{habit.title}</h4>
                  <button
                    onClick={() => editHabit(habit)}
                    type="button"
                    className="ml-auto outline"
                  >
                    [{editing?.id === habit.id ? "lukk" : "endre"}]
                  </button>
                  <button
                    onClick={() => removeHabit(habit.id)}
                    type="button"
                    className="ml-2 error"
                  >
                    [del]
                  </button>
                </header>
                {renderStreak(habit)}
              </li>
            ))
          )}
        </ul>
      </section>
      {/* Triks for å trigge recreate - useReducer oppdaterer ikke state ved rerender */}
      <HabitForm key={editing?.id} onSubmit={onSubmit} habit={editing} />
    </>
  );
}
