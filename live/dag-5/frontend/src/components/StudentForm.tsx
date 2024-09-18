import { useState } from "react";

type AddStudentFormProps = {
  onAddStudent: ({ name }: { name: string }) => void;
};

const AddStudentForm = ({ onAddStudent }: AddStudentFormProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.type, e.target?.tagName);

    if (name) {
      onAddStudent({ name });
      setName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-student-form">
      <label htmlFor="name">Studentens navn</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Studentens navn"
        required
      />
      <button type="submit">Legg til student</button>
    </form>
  );
};

export default AddStudentForm;
