import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import AuthenticationRefactored from "../AuthenticationRefactored";

let user: UserEvent;

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

const setup = ({
	onSubmit,
	isLoading,
	isError,
	isSuccess,
	error,
	validationError,
	handleFormUpdate,
}: AuthenticationProps) => {
	user = userEvent.setup({ delay: null });

	render(
		<AuthenticationRefactored
			onSubmit={onSubmit}
			error={error}
			isSuccess={isSuccess}
			isError={isError}
			isLoading={isLoading}
			validationError={validationError}
			handleFormUpdate={handleFormUpdate}
		/>,
	);
};

describe("AuthenticationRefactored", () => {
	it("Should render email field", () => {
		setup({} as any);
		expect(getEmailField()).toBeInTheDocument();
	});

	it("Should render password field", () => {
		setup({} as any);
		expect(getPasswordField()).toBeInTheDocument();
	});

	it("Should render button to create account", () => {
		setup({} as any);
		expect(screen.getByRole("button")).toBeInTheDocument();
	});

	it("should show error when validationError", async () => {
		setup({ validationError: "Form is invalid" } as any);
		expect(await getFormError()).toBeInTheDocument();
		expect(await (await getFormError()).textContent).toBe("Form is invalid");
	});

	it("should call onSubmit", async () => {
		const onSubmit = vi
			.fn()
			.mockImplementation((event: any) => event.preventDefault());
		setup({ onSubmit } as any);
		await user.click(getSubmitButton());
		expect(onSubmit).toHaveBeenCalled();
		expect(onSubmit).toHaveBeenCalledTimes(1);
	});

	it("should show success when isSuccess", async () => {
		setup({ isSuccess: true } as any);
		expect(await getSuccess()).toBeInTheDocument();
	});

	it("should show error when isError", async () => {
		setup({ isError: true, error: "Dummyerror" } as any);
		expect(await getError()).toBeInTheDocument();
		expect(await (await getError()).textContent).toBe("Dummyerror");
	});

	it("should show loading when isLoading", async () => {
		setup({ isLoading: true } as any);
		expect(await getLoading()).toBeInTheDocument();
	});

	it("should call handleFormUpdate when add content to password field", async () => {
		const handleFormUpdate = vi.fn();
		setup({ handleFormUpdate } as any);
		await user.type(getPasswordField(), "1234");
		expect(handleFormUpdate).toHaveBeenCalled();
		expect(handleFormUpdate).toHaveBeenCalledTimes(4);
	});
	it("should call handleFormUpdate when add content to email field", async () => {
		const handleFormUpdate = vi.fn();
		setup({ handleFormUpdate } as any);
		await user.type(getEmailField(), "test");
		expect(handleFormUpdate).toHaveBeenCalled();
		expect(handleFormUpdate).toHaveBeenCalledTimes(4);
	});
});

async function getFormError() {
	return await screen.findByTestId("form-error");
}

async function getError() {
	return await screen.findByTestId("error");
}

async function getSuccess() {
	return await screen.findByTestId("success");
}

function getLoading() {
	return screen.queryByText(/Loading/i);
}

function getSubmitButton() {
	return screen.getByRole("button");
}

function getEmailField() {
	return screen.getByLabelText(/epost/i);
}

function getPasswordField() {
	return screen.getByLabelText(/passord/i);
}
