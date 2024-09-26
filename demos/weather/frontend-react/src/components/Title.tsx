type TitleProps = {
  title: string;
};

export default function Title({ title }: TitleProps) {
  return <h1 className="title">{title}</h1>;
}
