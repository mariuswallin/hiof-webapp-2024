type AuthenticationProps = {
	onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	error: string;
	validationError: string;
	handleFormUpdate: (
		event: React.ChangeEvent<HTMLInputElement & HTMLSelectElement>,
	) => void;
};

export default function AuthenticationRefactored({
	onSubmit,
	isLoading,
	isError,
	isSuccess,
	error,
	validationError,
	handleFormUpdate,
}: Readonly<AuthenticationProps>) {
	return (
		<form onSubmit={onSubmit} aria-label="login" noValidate>
			<label htmlFor="email">
				<span>Epost</span>
				<input
					type="email"
					name="email"
					id="email"
					placeholder="Epost"
					autoComplete="email"
					onChange={handleFormUpdate}
				/>
			</label>
			<label htmlFor="password">
				<span>Passord</span>
				<input
					type="password"
					name="password"
					id="password"
					placeholder="Passord"
					autoComplete="current-password"
					onChange={handleFormUpdate}
				/>
			</label>
			<button type="submit">{isLoading ? "Loading" : "Lag ny bruker"}</button>
			{validationError ? (
				<p data-testid="form-error">{validationError}</p>
			) : null}
			{isError ? <p data-testid="error">{error}</p> : null}
			{isSuccess ? <p data-testid="success">Sendt</p> : null}
		</form>
	);
}
