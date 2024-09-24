import HabitsPage from "@/features/habits/pages";
import { makeClient, serviceFactory } from "@/features/habits/services/api";
import { cookies } from "next/headers";

export default async function Habits({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const cookieStore = cookies();
	const { name, value } = cookieStore.get("user.id") ?? {};

	const services = serviceFactory(
		makeClient({
			headers: { Cookie: `${name}=${value}` },
		}),
	);

	const result = await services.listStreaks(searchParams);
	const { data, pagination } = result;

	return <HabitsPage habits={data ?? []} initialPagination={pagination} />;
}
