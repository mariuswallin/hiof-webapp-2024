type CardProps = {
  title: string;
  description: string;
};

export default function Card(props: CardProps) {
  const { title = "Title", description = "Description" } = props;
  return (
    <article>
      <h2>{title}</h2>
      <p>{description}</p>
    </article>
  );
}
