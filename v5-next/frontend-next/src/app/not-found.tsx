import Link from "next/link";

export default function NotFound() {
	return (
		<div>
			<h2>Not Found</h2>
			<p>Fant ikke det du så etter</p>
			<Link href="/">Tilbake hjem</Link>
		</div>
	);
}
