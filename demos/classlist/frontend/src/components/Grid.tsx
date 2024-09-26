import Student, { type StudentProps } from "./Student";
import AddStudentForm from "./StudentForm";

type GridProps = {
	students: StudentProps[];
	onAddStudent: ({ name }: { name: string }) => void;
	onRemoveStudent: (id: string) => void;
};

// const Grid = ({ students }: GridProps) => {
//   return (
//     <div className="grid">
//       {students.map((student) => (
//         <Student key={student.id} id={student.id} name={student.name} />
//       ))}
//     </div>
//   );
// };

// import { useState } from "react";

// type GridProps = {
//   students: StudentProps[];
// };

// const Grid = ({ students: initialStudents }: GridProps) => {
//   const [students, setStudents] = useState<StudentProps[]>(initialStudents);
//   return (
//     <section>
//       <div className="grid">
//         {students.map((student) => (
//           <Student key={student.id} id={student.id} name={student.name} />
//         ))}
//       </div>
//       <AddStudentForm
//         onAddStudent={(student) => setStudents((prev) => [...prev, student])}
//       />
//     </section>
//   );
// };

// const Grid = ({ students, onAddStudent, onRemoveStudent }: GridProps) => {
//   return (
//     <section>
//       {students.length ? (
//         <div className="grid">
//           {students.map((student) => (
//             <Student
//               key={student.id}
//               id={student.id}
//               name={student.name}
//               onRemoveStudent={onRemoveStudent}
//             />
//           ))}
//         </div>
//       ) : (
//         <p>Ingen studenter</p>
//       )}
//       <AddStudentForm onAddStudent={onAddStudent} />
//     </section>
//   );
// };

const Grid = ({ data, renderItem, children }: any) => {
	return (
		<section>
			{data.length ? (
				<div className="grid">{data.map((item) => renderItem(item))}</div>
			) : (
				<p>Ingen data</p>
			)}
			{children}
		</section>
	);
};

export default Grid;
