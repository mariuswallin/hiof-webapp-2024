import Link from "next/link";

export default function Home() {
	return (
		<div>
			<h1>Velkommen til Habits!</h1>
			<Link href="/habits">Gå til habits</Link>
		</div>
	);
}
