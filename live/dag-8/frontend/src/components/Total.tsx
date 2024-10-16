export default function Total({ total }: Readonly<{ total: number }>) {
	if (total === 0) return null;

	return <div>Antall studenter: {total}</div>;
}
