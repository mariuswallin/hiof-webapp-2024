import { useState, type FormEvent, type PropsWithChildren } from "react";
import type { Action, Habit } from "./types";

import habitsApi from "./features/habits/services/api";

type HabitsProps = {
  handleHabitMutation: (action: Action, habit: Habit) => void;
  habits: Habit[];
  renderStreak: (habit: Habit) => React.ReactElement | null;
};

export default function Habits(
  props: Readonly<PropsWithChildren<HabitsProps>>
) {
  const { habits = [], handleHabitMutation, renderStreak, children } = props;
  const [titleValid, setTitleValid] = useState(false);
  const [titleIsDirty, setTitleIsDirty] = useState(false);
  const [titleIsTouched, setTitleIsTouched] = useState(false);
  const [title, setTitle] = useState("");

  const validateTitleInput = (title: string) => {
    if (titleIsTouched && titleIsDirty) {
      setTitleValid(title.trim().length > 2);
    }
  };

  const addHabit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) return;

    const form = event.target as HTMLFormElement | null;
    if (!form) return;

    // Endringen under ville ikke fungert
    // Må ha med endringen og sende den videre så her kan vi ikke ha inline på setHabits
    // setHabits(prev => ([...prev, { id: crypto.randomUUID(), title }]))
    // updateParentHabits(habits);
    const newHabit = await habitsApi.create({ title });

    if (newHabit) {
      handleHabitMutation("add", newHabit);
    }

    reset();
  };

  const reset = () => {
    setTitle("");
    setTitleIsDirty(false);
    setTitleIsTouched(false);
    setTitleValid(false);
  };

  const removeHabit = async (habit: Habit) => {
    await habitsApi.remove(habit);
    handleHabitMutation("remove", habit);
  };

  const updateTitle = (event: FormEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement | null;
    if (!input) return;
    setTitleIsDirty(true);
    setTitle(input.value);
  };

  const isInvalidTitle = !titleValid && titleIsDirty;

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
                    onClick={() => removeHabit(habit)}
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
      <section className="habits form-create">
        <h3>Legg til en ny habit</h3>
        {/* <pre>
        {JSON.stringify(
          { title, titleValid, titleIsDirty, titleIsTouched },
          null,
          2
        )}
      </pre> */}
        <div className="wrapper">
          <form onSubmit={addHabit}>
            <div className="title field">
              <label htmlFor="title">
                Navn på vanen:
                <span aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className={!isInvalidTitle ? "success" : ""}
                required
                placeholder="Legg til tittel"
                onChange={updateTitle}
                onFocus={() => {
                  // console.log("onFocus");
                  setTitleIsTouched(true);
                }}
                onBlur={() => {
                  // console.log("onBlur");
                  validateTitleInput(title);
                }}
                value={title}
              />
              {isInvalidTitle ? (
                <p className="field-error error">
                  Navnet må være minst 3 tegn langt
                </p>
              ) : null}
            </div>

            <div>
              <button type="submit" id="submit" className="success">
                Legg til
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
