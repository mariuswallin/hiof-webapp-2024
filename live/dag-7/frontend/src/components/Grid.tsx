import Student from "./Student";
import type { Student as StudentProp } from "./types";
// import AddStudentForm from "./AddStudentForm";
import type { PropsWithChildren } from "react";

type GridProps = {
  students: StudentProp[];
  // onAddStudent: ({ name }: { name: string }) => void;
  onRemoveStudent: (id: string) => void;
};

export default function Grid(props: PropsWithChildren<GridProps>) {
  // const { students, onAddStudent, onRemoveStudent, children } = props;
  const { students, onRemoveStudent, children } = props;

  return (
    <section>
      <article className="grid">
        {students.map((student) => (
          <Student
            key={student.id}
            name={student.name}
            id={student.id}
            onRemoveStudent={onRemoveStudent}
          />
        ))}
      </article>
      {/* <AddStudentForm onAddStudent={onAddStudent} /> */}
      {children}
    </section>
  );
}
