"use client";

import { useState, type PropsWithChildren } from "react";

import HabitForm from "./HabitForm";
import type { Habit, HandleMutation } from "../types";
import Link from "next/link";

type HabitsProps = {
	handleHabitMutation: HandleMutation;
	habits: Habit[];
	renderStreak: (
		habit: Habit,
	) => React.ReactElement | React.ReactElement[] | null;
	onSearch: ({ title }: { title: string }) => void;
};

export default function Habits(
	props: Readonly<PropsWithChildren<HabitsProps>>,
) {
	const {
		habits = [],
		handleHabitMutation,
		renderStreak,
		onSearch, // Tar i mot onSearch fra parent
		children,
	} = props;

	const [editing, setEditing] = useState<Habit | undefined>(undefined);

	const editHabit = (habit: Habit) => {
		if (editing?.id === habit.id) return setEditing(undefined);
		setEditing(habit);
	};

	const onSubmit = (id: string | undefined, data: Partial<Habit>) => {
		if (id) return handleHabitMutation({ action: "update", id, habit: data });
		return handleHabitMutation({ action: "add", habit: data });
	};

	const removeHabit = (id: string) => {
		handleHabitMutation({ action: "remove", id });
	};

	// Søk etter vaner
	// Trigges ved å trykke enter
	const searchHabits = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			// Henter ut verdien fra input
			const title = (event.target as HTMLInputElement).value;
			// Kaller onSearch fra parent
			onSearch({ title });
		}
	};

	return (
		<>
			<section className="list">
				<h3 className="mb-4">Oversikt over vaner</h3>
				<input
					type="search"
					placeholder="Søk etter en vane"
					onKeyDown={searchHabits}
				/>
				{children}
				<ul id="habits-wrapper">
					{habits.length === 0 ? (
						<li>Du har ingen vaner</li>
					) : (
						habits.map((habit) => (
							<li key={habit.id} className="habit-card">
								<header>
									<Link href={`/habits/${habit.id}`}>
										<h4>{habit.title}</h4>
									</Link>
									<button
										onClick={() => editHabit(habit)}
										type="button"
										className="ml-auto outline"
									>
										[{editing?.id === habit.id ? "lukk" : "endre"}]
									</button>
									<button
										onClick={() => removeHabit(habit.id)}
										type="button"
										className="ml-2 error"
									>
										[del]
									</button>
								</header>
								{renderStreak(habit)}
							</li>
						))
					)}
				</ul>
			</section>
			{/* Triks for å trigge recreate - useReducer oppdaterer ikke state ved rerender */}
			<HabitForm key={editing?.id} onSubmit={onSubmit} habit={editing} />
		</>
	);
}
