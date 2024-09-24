import type { Habit } from "../types";

export default function HabitPage({ habit }: { habit?: Habit }) {
	return (
		<section>
			<h1>{habit?.title}</h1>
			<p>{habit?.id}</p>
			<p>{JSON.stringify(habit?.streaks ?? [])}</p>
		</section>
	);
}
