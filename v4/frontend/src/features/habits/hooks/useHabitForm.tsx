import { useState, type FormEvent } from "react";

type FieldState = {
  value: string;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
};

type UseFormProps<T> = {
  initialFields: T;
  onSubmit: (data: T) => void;
  validate: {
    [K in keyof T]?: (field: K, value: string) => boolean;
  };
};

export function useHabitForm<T extends Record<string, string>>({
  initialFields,
  onSubmit,
  validate,
}: UseFormProps<T>) {
  const [fields, setFields] = useState<Record<keyof T, FieldState>>(
    Object.fromEntries(
      // Konverterer en liste med par til et objekt
      Object.keys(initialFields) // Henter nøklene fra initialFields
        .map((key) => [
          key as keyof T,
          {
            value: initialFields[key as keyof T],
            isValid: false,
            isDirty: false,
            isTouched: false,
          } as FieldState, // setter default verdier for feltene
        ])
    ) as Record<keyof T, FieldState>
  );

  const updateField = (field: keyof T, value: string) => {
    setFields((prev) => ({
      ...prev, // kopiere gamle verdier
      [field]: {
        ...prev[field], // kopierer dette feltet sine verdier
        value,
        isDirty: true,
        isValid: validate[field] ? validate[field](field, value) : true, // validerer feltet
      },
    }));
  };

  const setFieldTouched = (field: keyof T) => {
    setFields((prev) => ({
      ...prev,
      [field]: { ...prev[field], isTouched: true },
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Validerer om alle feltene er gyldige
    const isFormValid = Object.values(fields).every((field) => field.isValid);

    if (!isFormValid) return;

    // Henter ut alle verdiene fra feltene
    const formData = Object.fromEntries(
      Object.keys(fields).map((key) => [key, fields[key as keyof T].value])
    ) as T;

    onSubmit(formData);
    resetForm();
  };

  const resetForm = () => {
    setFields(
      Object.fromEntries(
        Object.keys(initialFields).map((key) => [
          key,
          {
            value: "",
            isValid: false,
            isDirty: false,
            isTouched: false,
          },
        ])
      ) as Record<keyof T, FieldState>
    );
  };

  const getFieldProps = (field: keyof T) => ({
    value: fields[field].value,
    onChange: (event: FormEvent<HTMLInputElement>) => {
      const input = event.target as HTMLInputElement;
      updateField(field, input.value);
    },
    onBlur: () => setFieldTouched(field),
  });

  const isFieldInvalid = (field: keyof T) =>
    !fields[field].isValid && fields[field].isDirty;

  return {
    fields,
    handleSubmit,
    getFieldProps,
    isFieldInvalid,
  };
}

export default useHabitForm;

// import { useState, type FormEvent } from "react";

// type UseHabitForm = {
//   handler: (title: string) => void;
// };

// export function useHabitForm(props: UseHabitForm) {
//   const { handler } = props;

//   const [titleValid, setTitleValid] = useState(false);
//   const [titleIsDirty, setTitleIsDirty] = useState(false);
//   const [titleIsTouched, setTitleIsTouched] = useState(false);
//   const [title, setTitle] = useState("");

//   const isInvalidTitle = !titleValid && titleIsDirty;

//   const validateTitleInput = (title: string) => {
//     if (titleIsTouched && titleIsDirty) {
//       setTitleValid(title.trim().length > 2);
//     }
//   };

//   const updateTitle = (event: FormEvent<HTMLInputElement>) => {
//     const input = event.target as HTMLInputElement | null;
//     if (!input) return;
//     setTitleIsDirty(true);
//     setTitle(input.value);
//   };

//   const reset = () => {
//     setTitle("");
//     setTitleIsDirty(false);
//     setTitleIsTouched(false);
//     setTitleValid(false);
//   };

//   const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     if (!titleValid) return;
//     handler(title);
//     reset();
//   };

//   return {
//     title,
//     handleSubmit,
//     isInvalidTitle,
//     updateTitle,
//     setTitleIsTouched,
//     validateTitleInput,
//   };
// }

// export default useHabitForm;
