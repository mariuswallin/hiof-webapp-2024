import Login from "../components/auth/Login";
import { useAuthContext } from "../context/AuthContext";

export default function AuthPage() {
	const { isLoggedIn, logout, login } = useAuthContext();
	return (
		<section>
      <h1>{ isLoggedIn ? 'Velkommen. Du er logget inn' : 'Logg inn'}</h1>
			{isLoggedIn ? (
				<button type="button" onClick={logout}>
					Logg ut
				</button>
			) : (
				<Login onLogin={login} />
			)}
		</section>
	);
}
