export default function Filter(props: {
  categories: string[];
  category: string;
}) {
  const { categories, category } = props;

  return (
    <div>
      <h2>Filter by category</h2>
      <select
        value={category}
        onChange={(e) => {
          console.log(e.target.value);
        }}
      >
        <option value="">All</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}
