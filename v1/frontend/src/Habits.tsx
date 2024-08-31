import { useState, type FormEvent } from "react";
import type { Action, Habit } from "./types";

import habitsApi from "./features/habits/services/api";

export default function Habits(props: {
  handleHabitMutation: (action: Action, habit: Habit) => void;
  habits: Habit[];
}) {
  const { habits = [], handleHabitMutation } = props;
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
    console.log("Created habit", newHabit);
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

  return (
    <section>
      <h3>Legg til en ny habit</h3>
      {/* <pre>
        {JSON.stringify(
          { title, titleValid, titleIsDirty, titleIsTouched },
          null,
          2
        )}
      </pre> */}
      <form onSubmit={addHabit}>
        <label htmlFor="title">
          Navn på vanen:
          <input
            type="text"
            id="title"
            name="title"
            onChange={updateTitle}
            onFocus={() => {
              console.log("onFocus");
              setTitleIsTouched(true);
            }}
            onBlur={() => {
              console.log("onBlur");
              validateTitleInput(title);
            }}
            value={title}
          />
        </label>
        <button type="submit">Legg til</button>
        {!titleValid && titleIsDirty ? (
          <p className="warning">Navnet må være minst 3 tegn langt</p>
        ) : null}
      </form>
      <h3>Oversikt over vaner</h3>
      <ul>
        {habits.length === 0 ? (
          <li>Du har ingen vaner</li>
        ) : (
          habits.map((habit) => (
            <li key={habit.id}>
              <p>{habit.title}</p>
              <button onClick={() => removeHabit(habit)} type="button">
                [-]
              </button>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
