import { type ChangeEvent, useState } from "react";

type ValidationOutput = { result: boolean; message: null | string };

type ValidationFunctions<T extends Record<keyof T, unknown>> = (
	value: unknown,
) => ValidationOutput;

export type ValidateForm<T> = Record<keyof T, ValidationFunctions<T>>;

type UseForm<T> = {
	initialState: T;
	validationFunc?: ValidateForm<T>;
	onSubmit?: (values?: Record<keyof T, unknown>) => Promise<void>;
};

export type ErrorResult<T> = Partial<Record<keyof T, ValidationOutput>>;

const isKeyInObject = <T,>(
	key: string | number | symbol,
	obj: Record<keyof T, unknown>,
): key is keyof T => key in obj;

export const useForm = <T extends Record<keyof T, unknown>>({
	initialState,
	onSubmit,
	validationFunc,
}: UseForm<T>) => {
	const [formValues, setFormValues] = useState(initialState);
	const [errors, setErrors] = useState<ErrorResult<T>[]>([]);
	const [submitError, setSubmitError] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleFormUpdate = (
		event: ChangeEvent<HTMLInputElement & HTMLSelectElement>,
	) => {
		const { value, name } = event.target;

		setFormValues((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		const keys = Object.keys(formValues);
		const validationResult = keys
			?.map((key) => {
				if (initialState && isKeyInObject(key, initialState)) {
					if (validationFunc && key in validationFunc) {
						const validationResult = validationFunc[key](formValues[key]);
						if (!validationResult.result) {
							return { [key]: validationResult };
						}
					}
				}
			})
			.filter(Boolean) as ErrorResult<T>[];
		if (validationResult?.length === 0) {
			setErrors([]);
			if (onSubmit) {
				setSubmitError("");
				setSubmitted(false);
				try {
					await onSubmit(formValues);
					setSubmitted(true);
				} catch (error) {
					setSubmitError(`Failed submitting form ${JSON.stringify(error)}`);
				}
			}
		} else {
			setErrors(validationResult);
		}
	};
	return {
		formValues,
		handleFormUpdate,
		handleSubmit,
		errors,
		submitError,
		submitted,
	};
};
