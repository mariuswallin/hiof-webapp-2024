import { useState, type FormEvent, type PropsWithChildren } from "react";

import habitsApi from "../services/api";
import type { Habit, HandleMutation } from "../types";

type HabitsProps = {
  handleHabitMutation: HandleMutation;
  habits: Habit[];
  renderStreak: (habit: Habit) => JSX.Element | null;
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

    const newHabit = await habitsApi.create({ title });

    if (newHabit) {
      handleHabitMutation({ action: "add", habit: newHabit });
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
    await habitsApi.remove(habit.id);
    handleHabitMutation({ action: "remove", id: habit.id });
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
      <section className="">
        <h3 className="mb-4 font-bold text-lg">Oversikt over vaner</h3>
        {children}
        <ul className="p-0 m-0 flex flex-col gap-4 w-full">
          {habits.length === 0 ? (
            <li>Du har ingen vaner</li>
          ) : (
            habits.map((habit) => (
              <li
                key={habit.id}
                className="p-4 w-full bg-white shadow-lg shadow-slate-300 rounded contain-inline-size"
              >
                <header className="flex justify-between">
                  <h4>{habit.title}</h4>
                  <button
                    onClick={() => removeHabit(habit)}
                    type="button"
                    className="flex items-center justify-center p-1 py-1 bg-red-800 text-white rounded max-w-max w-8 h-8"
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
      <section className="@container habits form-create">
        <h3>Legg til en ny habit</h3>
        <div className="wrapper">
          <form
            onSubmit={addHabit}
            className="m-0 flex flex-col w-full gap-4 h-full"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="font-semibold text-lg">
                Navn på vanen:
                <span aria-hidden="true">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                className={
                  !isInvalidTitle
                    ? "text-lg p-2 border border-slate-400 rounded-lg accent-sky-600 focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-opacity-50"
                    : ""
                }
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
                <p className="field-error text-red-600">
                  Navnet må være minst 3 tegn langt
                </p>
              ) : null}
            </div>

            <div>
              <button
                type="submit"
                id="submit"
                className="bg-green-600 text-white px-3 py-2 rounded-lg"
              >
                Legg til
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
