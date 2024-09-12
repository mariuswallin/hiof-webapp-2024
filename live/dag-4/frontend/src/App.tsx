import Card from "./components/Card";
import Title from "./components/Title";

function App() {
  return (
    <section>
      <Title title="Produkter" />
      <Title title="Medlemstilbud" />
      <Card title="CardTitle" description="CardDescription" />
      <Card title="CardTitle Two" description="CardDescription Two" />
    </section>
  );
}

export default App;
