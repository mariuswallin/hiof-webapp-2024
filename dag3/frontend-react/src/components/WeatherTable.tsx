import type { Weather } from "./types";

type WeatherTableProps = {
  weatherData: Pick<Weather, "place" | "today" | "tomorrow" | "deleted">[];
  handleRemoveWeather: (place: string) => void;
};

export default function WeatherTable(props: Readonly<WeatherTableProps>) {
  const { weatherData, handleRemoveWeather } = props;
  if (!weatherData) return null;

  return (
    <section className="weather-table" data-testid="weather-table">
      <h2>Oversikt</h2>
      {weatherData.length > 0 ? (
        <ul>
          {weatherData.map((weatherItem) => (
            <li key={weatherItem.place}>
              <div>
                <span>{weatherItem.place}</span>
                <span>{weatherItem.today}</span>
                <span>{weatherItem.tomorrow}</span>
              </div>
              {weatherItem.deleted ? (
                <p>[DELETED]</p>
              ) : (
                <button
                  type="button"
                  onClick={() => handleRemoveWeather(weatherItem.place)}
                >
                  Fjern
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Ingen data</p>
      )}
    </section>
  );
}
