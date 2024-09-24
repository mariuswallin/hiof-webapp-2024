import HabitRenderPage from "@/features/habits/pages/habit";
import { makeClient, serviceFactory } from "@/features/habits/services/api";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function HabitPage({
	params,
}: { params: { id: string } }) {
	const id = params.id;
	const cookieStore = cookies();
	const { name, value } = cookieStore.get("user.id") ?? {};

	const services = serviceFactory(
		makeClient({
			headers: { Cookie: `${name}=${value}` },
		}),
	);

	const result = await services.get(id);

	if (!result) return notFound();

	return <HabitRenderPage habit={result.data} />;
}
