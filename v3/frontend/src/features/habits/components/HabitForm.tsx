import useHabitForm from "../hooks/useHabitForm";
import useHabitReducerForm from "../hooks/useHabitReducerForm";

type HabitFormProps = {
  addHabit: (title: string) => void;
};

export default function HabitForm(props: Readonly<HabitFormProps>) {
  const { addHabit } = props;

  const { handleSubmit, getFieldProps, isFieldInvalid } = useHabitReducerForm({
    initialFields: { title: "" },
    onSubmit: (data) => addHabit(data.title),
    validate: {
      title: (_, value) => value.length > 2,
    },
  });

  return (
    <section className="habits form-create">
      <h3>Legg til en ny vane</h3>
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
              Legg til
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
