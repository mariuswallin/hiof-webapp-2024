import type { ChangeEvent, PropsWithChildren } from "react";

type FilterProps = {
	onFilterChange: (filter: string) => void;
	filters: { id: string; label: string; value: string }[];
	filter: string;
};
export default function Filter(props: PropsWithChildren<FilterProps>) {
	const { onFilterChange, children, filters, filter } = props;
	// const [filter, setFilter] = useState<string>(""); // => problem med rerender

	const simpleDebounce = (fn: (...args: string[]) => void, delay: number) => {
		let timeout: ReturnType<typeof setTimeout>;
		return (...args: string[]) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => fn(...args), delay);
		};
	};

	const handleFilter = (event: ChangeEvent<HTMLSelectElement>) => {
		simpleDebounce((name: string) => {
			onFilterChange(name);
		}, 500)(event.target.value);
	};

	return (
		<div className="filter">
			<select value={filter} onChange={handleFilter}>
				{[{ id: "default", value: "", label: "-" }, ...filters].map(
					({ id, label, value }) => (
						<option key={id} value={value}>
							{label}
						</option>
					),
				)}
			</select>
			{children}
		</div>
	);
}
