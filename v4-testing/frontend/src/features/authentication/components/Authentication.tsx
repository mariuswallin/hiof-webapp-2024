// Authentication.tsx
import { useState } from "react";
import { validateForm } from "../lib/validation";

type UserCredentials = {
	email: string;
	password: string;
};

const formValues = (
	elements: HTMLFormControlsCollection,
): Record<string, unknown> => {
	const values: UserCredentials = { email: "", password: "" };
	for (const el of elements) {
		if (el instanceof HTMLInputElement) {
			(values as { [key: string]: unknown })[el.name] = el.value;
		}
	}
	return values;
};

type ErrorWithMessage = {
	message: string;
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as Record<string, unknown>).message === "string"
	);
};

type AuthenticationProps = {
	onSubmit: (values: Record<string, unknown>) => Promise<void>;
};

export default function Authentication({ onSubmit }: AuthenticationProps) {
	const [status, setStatus] = useState("");
	const [error, setError] = useState<string>("");
	const [validationError, setValidationError] = useState<string>("");
	const isLoading = status === "loading";
	const isSuccess = status === "success";
	const isError = status === "error";

	const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setValidationError("");
		const target = event.currentTarget;
		const elements = target.elements;
		const values = formValues(elements);

		if (!validateForm(values)) {
			setValidationError("Ugyldig e-post eller passord");
			return;
		}

		setStatus("loading");
		try {
			await onSubmit(values);
			setStatus("success");
		} catch (error) {
			setStatus("error");
			setError(isErrorWithMessage(error) ? error.message : "Noe gikk galt");
		}
	};

	return (
		<form onSubmit={handleFormSubmit} noValidate>
			<label htmlFor="email">
				<span>Epost</span>
				<input type="email" name="email" id="email" placeholder="Epost" />
			</label>
			<label htmlFor="password">
				<span>Passord</span>
				<input
					type="password"
					name="password"
					id="password"
					placeholder="Passord"
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
