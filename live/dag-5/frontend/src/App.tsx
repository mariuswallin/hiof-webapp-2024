import { useEffect, useState } from "react";

import Grid from "./components/Grid";
import type { StudentProps } from "./components/Student";
import Total from "./components/Total";
import Student from "./components/Student";
import AddStudentForm from "./components/StudentForm";

function App() {
  const [students, setStudents] = useState<StudentProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3999/api/students");
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        setError("Noe gikk galt");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

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
      <Grid
        data={students}
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
