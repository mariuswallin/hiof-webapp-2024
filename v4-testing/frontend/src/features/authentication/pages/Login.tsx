import Layout from "@/components/Layout";
import { useApi } from "@/hooks/useApi";
import { useForm } from "@/hooks/useForm";
import AuthenticationRefactored from "../components/AuthenticationRefactored";

const validationFunc = {
	email: (value: unknown) => {
		if (value && typeof value === "string" && value.length > 4) {
			return { result: true, message: null };
		}
		return { result: false, message: "Email is not valid" };
	},
	password: (value: unknown) => {
		if (
			value &&
			typeof value === "string" &&
			value.length > 4 &&
			value.indexOf("2") >= 0
		) {
			return { result: true, message: null };
		}
		return { result: false, message: "Password is not valid" };
	},
};

type User = { email: string; password: string };

export default function Login() {
	// Bruker useApi med url
	const { handler, isSuccess, isError, isLoading, error } = useApi({
		url: "http://localhost:1337/api/authenticate/login",
	});

	// Bruker useForm hook
	const { errors, handleSubmit, handleFormUpdate, submitError, submitted } =
		useForm<User>({
			initialState: { email: "", password: "" },
			onSubmit: (values) => handler("POST", values),
			validationFunc,
		});

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		await handleSubmit();
	};

	return (
		<Layout>
			<h1>Login</h1>
			<AuthenticationRefactored
				onSubmit={onSubmit}
				error={isError ? error?.error ?? submitError ?? "Noe gikk galt" : ""}
				isSuccess={!isError && (isSuccess || submitted) && errors?.length === 0}
				isError={isError || !!submitError}
				isLoading={isLoading}
				validationError={errors?.length > 0 ? JSON.stringify(errors) : ""}
				handleFormUpdate={handleFormUpdate}
			/>
		</Layout>
	);
}
