import { useState } from "react";

type LoginProps = {
	onLogin: (username: string, password: string) => Promise<void>;
};

export default function Login(props: Readonly<LoginProps>) {
	const [validationError, setValidationError] = useState<string | null>("");

	const { onLogin } = props;

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = new FormData(e.currentTarget);

		const username = form.get("username") as string;
		const password = form.get("password") as string;

		if (!username || !password) {
			setValidationError("Fyll ut epost og passord");
			return;
		}
		onLogin(username, password);
	};

	return (
		<form onSubmit={handleSubmit}>
			<label htmlFor="username">Brukernavn</label>
			<input type="text" id="username" name="username" autoComplete="username" />
			<label htmlFor="password">Passord</label>
			<input
				type="password"
				id="password"
				name="password"
				autoComplete="new-password"
			/>
			{validationError ? <p>{validationError}</p> : null}
			<button type="submit">Logg inn</button>
		</form>
	);
}
