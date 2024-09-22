import { render, screen, waitFor } from "@testing-library/react";
import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
	type MockInstance,
} from "vitest";
import Authentication from "../Authentication";
// userEvent er et bibliotek som simulerer brukerinteraksjon
import userEvent, { type UserEvent } from "@testing-library/user-event";
// Lager en variabel som skal holde på brukerinteraksjonen
let user: UserEvent;
// Lager en variabel som skal holde på spionen
let onSubmit: MockInstance;

// describe-funksjonen beskriver hva som skal testes
describe("Authentication", () => {
	// Trigges før hver test
	beforeEach(() => {
		// Setter opp brukerinteraksjonen
		// delay: null gjør at det ikke er noen forsinkelse på interaksjonen
		user = userEvent.setup({ delay: null });
		// Lager en spion for å se om riktig data blir logget
		onSubmit = vi.fn();
		// Rendrer Authentication-komponenten med onSubmit-funksjonen
		render(<Authentication onSubmit={onSubmit} />);
	});

	// Trigges etter hver test
	afterEach(() => {
		// Rydder opp etter hver test
		// Vi må rydde opp for å unngå at det blir liggende igjen data fra forrige test
		vi.resetAllMocks();
	});

	// it-funksjonen beskriver hva som skal testes
	it("Should render email field", () => {
		expect(getEmailField()).toBeInTheDocument();
	});
	it("Should render password field", () => {
		expect(getPasswordField()).toBeInTheDocument();
	});
	it("Should render button to create account", () => {
		expect(screen.getByRole("button")).toBeInTheDocument();
	});
	describe("When adding wrong credentials", () => {
		// it.each-funksjonen gjør at vi kan kjøre samme test med ulike parametere
		it.each([
			"test",
			"test.no",
			"test$test.no",
			"te@r.no",
			"@.",
			"test@test.com",
		])(
			"should show error when email, %s, credentials are wrong",
			async (input) => {
				const { password } = createDefaultFormCredentials();
				await typeFormData(input, password);
				await user.click(getSubmitButton());
				// expect(screen.queryByTestId("error")).toBeInTheDocument();
				expect(await getFormError()).toBeInTheDocument();
			},
		);
		it("should show error when password is to short", async () => {
			const { email } = createDefaultFormCredentials();
			await typeFormData(email, "123");
			await user.click(getSubmitButton());
			// expect(screen.queryByTestId("error")).toBeInTheDocument();
			expect(await getFormError()).toBeInTheDocument();
		});
	});
	describe("When adding correct credentials", () => {
		beforeEach(async () => {
			const { email, password } = createDefaultFormCredentials();
			await typeFormData(email, password);
		});
		it.skip("Should console log values given by the user", async () => {
			const logSpy = vi.spyOn(console, "log");
			// Awaiter all state oppdateringer => vis loading, deretter vis error
			await user.click(getSubmitButton());
			expect(logSpy).toHaveBeenCalledWith(
				expect.objectContaining(createDefaultFormCredentials()),
			);
		});
		it("Should handle values given by the user (through props)", async () => {
			// Awaiter all state oppdateringer => vis loading, deretter vis error
			await user.click(getSubmitButton());
			expect(onSubmit).toBeCalledTimes(1);
			expect(onSubmit).toHaveBeenCalledWith(createDefaultFormCredentials());
		});
		it("Should show loading when sending form", async () => {
			// Da denne ikke er await vil "Loading" bli vist
			// Den stopper med andre ord på hver state endring
			user.click(getSubmitButton());
			// waitFor-funksjonen venter på at Loading vises
			await waitFor(() => {
				expect(getLoading()).toBeInTheDocument();
			});
		});

		it("Should remove loading", async () => {
			// Later som at onSubmit er ok
			onSubmit.mockResolvedValue({});

			// Da denne ikke er await vil "Loading" bli vist
			// Den stopper med andre ord på hver state endring
			user.click(getSubmitButton());

			await waitFor(() => {
				expect(getLoading()).toBeInTheDocument();
			});

			expect(getLoading()).not.toBeInTheDocument();
		});
		it("Should show success when form successfully submitted", async () => {
			// Later som at onSubmit er ok
			onSubmit.mockResolvedValue({});

			// Lar alle state updates fullføres
			await user.click(getSubmitButton());
			expect(await getSuccess()).toBeInTheDocument();
		});
		it("Should show error when form submission fails", async () => {
			// Later som at onSubmit gir en feil
			onSubmit.mockRejectedValue(new Error("Async error"));

			// Lar alle state updates fullføres
			await user.click(getSubmitButton());
			expect(await getError()).toBeInTheDocument();
			expect(await (await getError()).textContent).toMatch(/async error/i);
		});
	});
});

function createDefaultFormCredentials(
	email = "mail@test.no",
	password = "123456",
) {
	return {
		email,
		password,
	};
}

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

async function typeFormData(email: string, password: string) {
	await user.type(getEmailField(), email);
	await user.type(getPasswordField(), password);
}
