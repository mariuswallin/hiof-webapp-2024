import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Authentication from "../Authentication";
import "@testing-library/jest-dom";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import * as Validation from "../../lib/validation";

let user: UserEvent;

const spy = vi.spyOn(Validation, "validateForm");

describe("Authentication with validation mock", () => {
	beforeEach(() => {
		user = userEvent.setup({ delay: null });
		render(<Authentication onSubmit={() => {}} />);
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	describe("When adding credentials", () => {
		it("should show error when form is invalid", async () => {
			await user.type(screen.getByLabelText(/epost/i), "test");
			await user.type(screen.getByLabelText(/passord/i), "test");
			spy.mockReturnValue(false);
			await user.click(screen.getByRole("button"));
			expect(await screen.findByTestId("form-error")).toBeInTheDocument();
		});
		it("should show success when form is valid", async () => {
			await user.type(screen.getByLabelText(/epost/i), "test");
			await user.type(screen.getByLabelText(/passord/i), "test");
			spy.mockReturnValue(true);
			await user.click(screen.getByRole("button"));
			expect(await screen.findByTestId("success")).toBeInTheDocument();
		});
	});
});
