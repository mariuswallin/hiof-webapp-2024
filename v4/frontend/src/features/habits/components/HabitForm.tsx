// import useHabitForm from "../hooks/useHabitForm";
import { useEffect } from "react";
import useHabitReducerForm from "../hooks/useHabitReducerForm";
import type { Habit } from "../types";

// TODO: Potential issue - hvis flere actions
// type HabitFormProps = {
//   addHabit: (title: string) => void;
//   updateHabit: (id: string, data: Partial<Habit>) => void;
// };

type HabitFormProps = {
  onSubmit: (id: string | undefined, data: Partial<Habit>) => void;
  habit?: Habit;
};

export default function HabitForm(props: Readonly<HabitFormProps>) {
  const { onSubmit, habit } = props;

  const isEditing = !!habit;

  const { handleSubmit, getFieldProps, isFieldInvalid } = useHabitReducerForm({
    initialFields: { title: habit?.title ?? "" },
    onSubmit: (data) => onSubmit(habit?.id, data),
    validate: {
      title: (_, value) => value.length > 2,
    },
  });

  const labels = {
    edit: {
      title: "Endre tittel på vane",
      submit: "Endre vane",
    },
    add: {
      title: "Legg til en ny vane",
      submit: "Legg til vane",
    },
  };

  return (
    <section className="habits form-create">
      <h3>{isEditing ? labels.edit.title : labels.add.title}</h3>
      {/* <pre>
        {JSON.stringify(
          { title, titleValid, titleIsDirty, titleIsTouched },
          null,
          2
        )}
      </pre> */}
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <div className="title field">
            <label htmlFor="title">
              Navn på vanen:
              <span aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className={!isFieldInvalid ? "success" : ""}
              required
              placeholder="Legg til tittel"
              {...getFieldProps("title")}
            />
            {isFieldInvalid("title") ? (
              <p className="field-error error">
                Navnet må være minst 3 tegn langt
              </p>
            ) : null}
          </div>

          <div>
            <button type="submit" id="submit" className="success">
              {isEditing ? labels.edit.submit : labels.add.submit}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
