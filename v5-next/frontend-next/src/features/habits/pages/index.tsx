"use client";

import { ofetch } from "ofetch";

import Habits from "../components/Habits";

import Streak from "@/features/streaks/components/Streak";
import StreakTotal from "@/features/streaks/components/StreakTotal";
import useHabits from "../hooks/useHabits";
import type { Habit, HandleMutation, Pagination } from "../types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function HabitPage({
	habits: initialHabits = [],
	initialPagination = null,
}: {
	habits: Habit[];
	initialPagination: Pagination | null;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { add, remove, update, status, get, data, error, pagination } =
		useHabits({
			initialHabits: initialHabits,
			initialFetch: false,
			initialPagination: initialPagination,
		});

	const habits = data.length ? data : [];

	const handleHabitMutation: HandleMutation = (props) => {
		const { action } = props;

		switch (action) {
			case "add":
				add(props.habit);
				break;
			case "remove":
				remove(props.id);
				break;
			case "update":
				update(props.id, props.habit);
				break;
			default:
				break;
		}
	};

	const addStreakServer = async (id: string) => {
		try {
			return ofetch("http://localhost:3999/v1/streaks", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					note: "",
					habitId: id,
				}),
			});
		} catch (error) {
			console.error(error);
		}
	};

	const addStreak = async (id: string) => {
		const updatedStreak = await addStreakServer(id);

		if (!updatedStreak) return;

		await get();
	};

	// Tar i mot filtre
	const onSearch = async (data: {
		title?: string;
		page_size?: string;
		page?: string;
	}) => {
		const { title, page_size, page } = data;
		// Henter ut URLSearchParams fra searchParams
		// Hvis det ikke er noen, lager vi en ny med default verdier
		// Hvis det er noen, henter vi ut alle parametrene
		const params = new URLSearchParams(searchParams.toString());
		params.set("title", title ?? params.get("title") ?? "");
		// Setter liten page_size for å vise paginering
		params.set("page_size", page_size ?? params.get("page_size") ?? "2");
		params.set("page", page ?? params.get("page") ?? "1");
		// Setter URLSearchParams til å være querystringen
		// Urlen vår blir da oppdatert med nye parametre
		// Denne kunne vi delt med andre slik at du oppnår samme filter og paginering
		router.push(`${pathname}?${params.toString()}`);

		// Konverterer URLSearchParams til objekt som get krever
		const filters = Object.fromEntries(params.entries());

		await get(filters);
	};

	const calculateTotalStreaks = () => {
		let total = 0;

		for (const habit of habits) {
			total += habit?.streaks?.length ?? 0;
		}
		return total;
	};

	if (status.loading) return <p>Laster ...</p>;
	if (status.error) return <p className="error">{error}</p>;

	return (
		<>
			<Habits
				habits={habits}
				onSearch={onSearch}
				handleHabitMutation={handleHabitMutation}
				renderStreak={(habit) => {
					const streaks = habit.streaks;

					return (
						<>
							<ul>
								{streaks?.map((streak) => (
									<Streak key={streak.id} {...streak} />
								))}
							</ul>
							<button
								type="button"
								className="mt-4"
								onClick={() => addStreak(habit.id)}
							>
								Legg til streak
							</button>
						</>
					);
				}}
			>
				<StreakTotal
					streakCount={habits.length}
					// streakCount={streaks.length}
					totalStreak={calculateTotalStreaks()}
				/>
				{/* <pre>{JSON.stringify(status)}</pre> */}
			</Habits>
			{/* 
        Hvis vi har paginering, viser vi knapper for å navigere
        Hvis vi ikke har paginering, viser vi ingenting
      */}
			{pagination ? (
				<section>
					{pagination.hasPreviousPage ? (
						<button
							type="button"
							onClick={() => onSearch({ page: `${pagination.page - 1}` })}
						>
							Forrige
						</button>
					) : null}
					{pagination.hasNextPage ? (
						<button
							type="button"
							onClick={() => onSearch({ page: `${pagination.page + 1}` })}
						>
							Neste
						</button>
					) : null}

					<p>Current: {pagination.page}</p>
				</section>
			) : null}
		</>
	);
}
