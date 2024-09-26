import { useEffect, useState } from "react";

import Grid from "./components/Grid";
import type { StudentProps } from "./components/Student";
import Total from "./components/Total";
import Student from "./components/Student";
import AddStudentForm from "./components/StudentForm";
import Filter from "./components/Filter";

function App() {
	const [students, setStudents] = useState<StudentProps[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [filter, setFilter] = useState<string>("-");

	const filteredStudents = students.filter((item: StudentProps) =>
		filter !== "-" ? item.name.toLowerCase().includes(filter) : true,
	);

	const filters = Array.from(
		students
			.reduce((acc, student: StudentProps) => {
				const name = student.name.trim().split(" ")[0];
				if (acc.has(name)) return acc;

				return acc.set(name, {
					...student,
					value: name.toLowerCase(),
					label: name,
				});
			}, new Map())
			.values(),
	);

	useEffect(() => {
		const fetchStudents = async () => {
			try {
				setLoading(true);
				const response = await fetch("http://localhost:3999/api/students");
				const data = await response.json();
				if (localStorage.getItem("filter")) {
					setFilter(localStorage.getItem("filter") || "-");
				}
				setStudents(data);
			} catch (error) {
				setError("Noe gikk galt");
			} finally {
				setLoading(false);
			}
		};
		fetchStudents();
	}, []);

	const onFilterChange = (filter: string) => {
		localStorage.setItem("filter", filter);
		setFilter(filter);
	};

	const onAddStudent = async ({ name }: { name: string }) => {
		try {
			const response = await fetch("http://localhost:3999/api/students", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, id: `${crypto.randomUUID()}` }),
			});
			const data = await response.json();
			setStudents(data);
		} catch (error) {
			setError("Noe gikk galt");
		}
	};

	const onRemoveStudent = async (id: string) => {
		try {
			const response = await fetch(`http://localhost:3999/api/students/${id}`, {
				method: "DELETE",
			});
			const data = await response.json();
			setStudents(data);
		} catch (error) {
			setError("Noe gikk galt");
		}
	};

	const onEditStudentName = async (id: string, name: string) => {
		try {
			const response = await fetch(`http://localhost:3999/api/students/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name }),
			});
			const data = await response.json();
			setStudents(data);
		} catch (error) {
			setError("Noe gikk galt");
		}
	};

	if (loading) {
		return <p>Laster...</p>;
	}

	return (
		<main className="app">
			<h1>Klasseliste</h1>
			{error && <p>{error}</p>}
			<Filter
				onFilterChange={onFilterChange}
				filter={filter}
				filters={Object.values(filters)}
			>
				<Grid
					data={filteredStudents}
					renderItem={({ id, name }) => (
						<Student
							key={id}
							id={id}
							name={name}
							onRemoveStudent={onRemoveStudent}
							onEditStudentName={onEditStudentName}
						/>
					)}
				>
					<AddStudentForm onAddStudent={onAddStudent} />
				</Grid>
			</Filter>
			{/* <Total total={0} /> */}
			<Total total={students.length} />
		</main>
	);
}

// function App() {
//   const [students, setStudents] = useState<StudentProps[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:3999/api/students");
//         const data = await response.json();
//         setStudents(data);
//       } catch (error) {
//         setError("Noe gikk galt");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStudents();
//   }, []);

//   const onAddStudent = async ({ name }: { name: string }) => {
//     try {
//       const response = await fetch("http://localhost:3999/api/students", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ name, id: `${crypto.randomUUID()}` }),
//       });
//       const data = await response.json();
//       setStudents(data);
//     } catch (error) {
//       setError("Noe gikk galt");
//     }
//   };

//   const onRemoveStudent = async (id: string) => {
//     try {
//       const response = await fetch(`http://localhost:3999/api/students/${id}`, {
//         method: "DELETE",
//       });
//       const data = await response.json();
//       setStudents(data);
//     } catch (error) {
//       setError("Noe gikk galt");
//     }
//   };

//   if (loading) {
//     return <p>Laster...</p>;
//   }

//   return (
//     <main className="app">
//       <h1>Klasseliste</h1>
//       {error && <p>{error}</p>}
//       <Grid
//         data={students}
//         renderItem={({ id, name }) => (
//           <Student
//             key={id}
//             id={id}
//             name={name}
//             onRemoveStudent={onRemoveStudent}
//           />
//         )}
//       >
//         <AddStudentForm onAddStudent={onAddStudent} />
//       </Grid>
//       <Dummy />
//       {/* <Total total={0} /> */}
//       <Total total={students.length} />
//     </main>
//   );
// }

// const initialStudents: StudentProps[] = [
//   { id: "1", name: "Ola Normann" },
//   { id: "2", name: "Kari Normann" },
//   { id: "3", name: "Per Norm" },
// ];

// function App() {
//   const [students, setStudents] = useState<StudentProps[]>(initialStudents);

//   return (
//     <main className="app">
//       <h1>Klasseliste</h1>
//       <Grid
//         data={students}
//         renderItem={({ id, name }) => (
//           <Student
//             key={id}
//             id={id}
//             name={name}
//             onRemoveStudent={(id) =>
//               setStudents((prev) => prev.filter((student) => student.id !== id))
//             }
//           />
//         )}
//       >
//         <AddStudentForm
//           onAddStudent={(student) => setStudents((prev) => [...prev, student])}
//         />
//       </Grid>
//       <Dummy />
//       {/* <Total total={0} /> */}
//       <Total total={students.length} />
//     </main>
//   );
// }

// function App() {
//   const [students, setStudents] = useState<StudentProps[]>(initialStudents);

//   return (
//     <main className="app">
//       <h1>Klasseliste</h1>
//       <Grid
//         students={students}
//         onAddStudent={(student) =>
//           setStudents((prev) => [
//             ...prev,
//             { ...student, id: `${crypto.randomUUID()}` },
//           ])
//         }
//         onRemoveStudent={(id) =>
//           setStudents((prev) => prev.filter((student) => student.id !== id))
//         }
//       />
//       <Dummy />
//       {/* <Total total={0} /> */}
//       <Total total={students.length} />
//     </main>
//   );
// }

export default App;
