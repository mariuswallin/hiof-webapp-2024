import type { ChangeEvent, PropsWithChildren } from "react";

type FilterProps = {
  filter: string;
  options: { id: string; label: string; value: string }[];
  onFilterChange: (filter: string) => void;
};

export default function Filter(props: PropsWithChildren<FilterProps>) {
  const { onFilterChange, filter, options } = props;

  const handleFilter = (event: ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(event.target.value);
  };

  return (
    <section className="filter">
      <select value={filter} onChange={handleFilter}>
        {[{ id: "default", value: "", label: "-" }, ...options].map(
          ({ id, label, value }) => (
            <option key={id} value={value}>
              {label}
            </option>
          )
        )}
      </select>
    </section>
  );
}
