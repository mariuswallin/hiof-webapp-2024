type WelcomeProps = {
  user: {
    name: string;
    age: number;
  };
};

export default function Welcome(props: Readonly<WelcomeProps>) {
  const { user } = props;

  return (
    <header>
      <h1>Hei, {user.name}!</h1>
      <p>Du er {user.age} år gammel.</p>
    </header>
  );
}
