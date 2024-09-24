import type { PropsWithChildren } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

type LayoutProps = PropsWithChildren;

export default function Layout(props: LayoutProps) {
	const { children } = props;

	return (
		<>
			<header>
				<Navigation />
			</header>
			<main className="container">{children}</main>
			<Footer />
		</>
	);
}
