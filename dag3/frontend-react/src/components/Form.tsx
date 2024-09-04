import { useState } from "react";
import type { Weather } from "./types";

type FormData = Weather;

type FormProps = {
  createWeatherItem: (data: FormData) => void;
};

const weatherTypes = ["rain", "sun", "cloudy"];

const isValid = ({ place, today, tomorrow }: FormData) => {
  return (
    place &&
    place.length > 2 &&
    today &&
    tomorrow &&
    [today, tomorrow].every((weather) => weatherTypes.includes(weather))
  );
};

export default function Form({ createWeatherItem }: Readonly<FormProps>) {
  const [data, setData] = useState<FormData>({
    place: "",
    tomorrow: "",
    today: "",
  });

  const [isDirty, setDirty] = useState(false);

  const showError = !isValid(data) && isDirty;

  const handleData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target?.id;
    if (id && Object.keys(data).includes(id)) {
      setDirty(true);
      setData((prev) => ({ ...prev, [id]: event.target.value }));
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValid(data)) {
      createWeatherItem(data);
    }
  };

  return (
    <form className="form" onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="place">Sted</label>
        <input
          id="place"
          data-testid="place"
          type="text"
          name="place"
          placeholder="Sted"
          required
          onChange={handleData}
          value={data.place}
        />
      </div>
      <div>
        <label htmlFor="today">I dag</label>
        <input
          id="today"
          data-testid="today"
          type="text"
          name="today"
          placeholder="Dagens vær"
          required
          onChange={handleData}
          value={data.today}
        />
      </div>
      <div>
        <label htmlFor="tomorrow">I morgen</label>
        <input
          id="tomorrow"
          data-testid="tomorrow"
          type="text"
          name="tomorrow"
          placeholder="Morgendagens vær"
          required
          onChange={handleData}
          value={data.tomorrow}
        />
      </div>
      {showError ? (
        <span className="error" data-testid="error">
          Sted må være minst 3 tegn og været i dag og morgen må være en av:{" "}
          {weatherTypes.join(", ")}
        </span>
      ) : null}
      <button type="submit" disabled={!isValid(data)}>
        Send
      </button>
    </form>
  );
}
