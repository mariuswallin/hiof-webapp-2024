import { server } from "@/mocks/node";
import { http, HttpResponse } from "msw";

import { render, screen } from "@testing-library/react";

import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import userEvent, { type UserEvent } from "@testing-library/user-event";
import Login from "../Login";

let user: UserEvent;

const url = "http://localhost:1337/api/authenticate/login";

const setup = () => {
	user = userEvent.setup();
	render(<Login />);
};

describe("Login Page", () => {
	// Setter opp serveren før testene kjører
	beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

	// Lukker serveren etter at testene har kjørt
	afterAll(() => server.close());

	// Nullstiller handlere etter hver test
	// Dette er for å unngå at en handler påvirker en annen test
	afterEach(() => server.resetHandlers());

	it("should render heading", () => {
		render(<Login />);
		expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
	});

	it("should render a form with email, password and submit", async () => {
		render(<Login />);
		expect(screen.getByRole("form")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /lag/i })).toBeInTheDocument();
		expect(screen.getByLabelText(/epost/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/passord/i)).toBeInTheDocument();
	});

	describe("When submitting the form", () => {
		it("should show error when api fails", async () => {
			// Vi simulerer en feil fra serveren
			server.use(
				http.post(url, async () => {
					return HttpResponse.json(
						{
							success: false,
							error: "Error from server",
						},
						{ status: 500 },
					);
				}),
			);
			setup();
			await user.type(screen.getByLabelText(/epost/i), "test@test.no");
			await user.type(screen.getByLabelText(/passord/i), "123456");
			await user.click(screen.getByRole("button"));
			const error = await screen.findByTestId("error");
			expect(error).toBeInTheDocument();
			expect(error.textContent).toMatch(/error from server/i);
		});

		it("should show error when fields are empty", async () => {
			setup();
			await user.click(screen.getByRole("button"));
			expect(await screen.findByTestId("form-error")).toBeInTheDocument();
		});
		it("should show success when fields are valid in client", async () => {
			// Vi simulerer en suksess fra serveren
			server.use(
				http.post(url, async () => {
					return HttpResponse.json(
						{ success: true, data: "User created" },
						{ status: 201 },
					);
				}),
			);
			setup();
			await user.type(screen.getByLabelText(/epost/i), "test@test.no");
			await user.type(screen.getByLabelText(/passord/i), "123456");
			await user.click(screen.getByRole("button"));

			expect(screen.queryByTestId("form-error")).not.toBeInTheDocument();
			expect(await screen.findByTestId("success")).toBeInTheDocument();
		});
		it.each(["123", "14456"])(
			"should show error when password validation fails in client",
			async (password) => {
				setup();
				await user.type(screen.getByLabelText(/epost/i), "test@test.no");

				await user.type(screen.getByLabelText(/passord/i), password);
				await user.click(screen.getByRole("button"));
				expect(await screen.findByTestId("form-error")).toBeInTheDocument();
				expect(
					await screen.findByText(/password is not valid/i),
				).toBeInTheDocument();
			},
		);
		it.each(["tes"])(
			"should show error when email validation fails in client",
			async (email) => {
				setup();
				await user.type(screen.getByLabelText(/epost/i), email);
				await user.type(screen.getByLabelText(/passord/i), "123456");
				await user.click(screen.getByRole("button"));
				expect(await screen.findByTestId("form-error")).toBeInTheDocument();
				expect(
					await screen.findByText(/email is not valid/i),
				).toBeInTheDocument();
			},
		);
		it("should show error when password validation fails on server", async () => {
			// Vi simulerer en feil fra serveren grunnet feil ved passord
			server.use(
				http.post(url, async () => {
					return HttpResponse.json(
						{ success: false, error: "Password not valid" },
						{ status: 400 },
					);
				}),
			);
			setup();
			await user.type(screen.getByLabelText(/epost/i), "test@test.no");
			await user.type(screen.getByLabelText(/passord/i), "123456");
			await user.click(screen.getByRole("button"));
			expect(await screen.findByTestId("error")).toBeInTheDocument();
			expect(
				await screen.findByText(/password not valid/i),
			).toBeInTheDocument();
		});
		it("should show error when email validation fails on server", async () => {
			// Vi simulerer en feil fra serveren grunnet feil ved epost
			server.use(
				http.post(url, async () => {
					return HttpResponse.json(
						{ success: false, error: "Email not valid" },
						{ status: 400 },
					);
				}),
			);
			setup();
			await user.type(screen.getByLabelText(/epost/i), "test@test.no");
			await user.type(screen.getByLabelText(/passord/i), "123456");
			await user.click(screen.getByRole("button"));
			expect(await screen.findByTestId("error")).toBeInTheDocument();
			expect(await screen.findByText(/email not valid/i)).toBeInTheDocument();
		});
	});
});
