import { useState } from "react";
import Layout from "./components/Layout";
import AuthPage from "./pages/Auth";
import StudentsPage from "./pages/Students";
import { AuthProvider } from "./context/AuthContext";

function App() {
	const [page, setPage] = useState("students");

	const pages = {
		students: <StudentsPage />,
		auth: <AuthPage />,
	};

	return (
		<Layout>
			<nav>
				<button type="button" onClick={() => setPage("students")}>
					Studenter
				</button>
				<button type="button" onClick={() => setPage("auth")}>
					Auth
				</button>
			</nav>
			<AuthProvider>{pages[page as keyof typeof pages]}</AuthProvider>
		</Layout>
	);
}

export default App;
