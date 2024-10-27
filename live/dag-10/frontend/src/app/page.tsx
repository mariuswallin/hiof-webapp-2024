export default function Home() {
  return (
    <div>
      <main>
        <h1 className="text-4xl font-bold text-center">Task oppgave</h1>
        <ul>
          <li>Lag en custom hook knyttet til å hente en eller alle tasks</li>
          <li>Lag TasksList og Task komponent</li>
          <li>Vis alle tasks i TasksList</li>
          <li>Vis en task i Task komponent</li>
          <li>
            Lag lagdelt backend for å håndtere det å hente en task og alle
            tasks, med database
          </li>
        </ul>
      </main>
    </div>
  );
}
