type TitleProps = { title: string };

export default function Title(props) {
  const { title } = props;
  return <h1>{title}</h1>;
}
