import { useEffect, useState } from "react";
import StaticText from "./components/StaticText";
import Title from "./components/Title";
import type { Weather } from "./components/types";
import WeatherTable from "./components/WeatherTable";
import Form from "./components/Form";
import Layout from "./components/Layout";

function App() {
  const [weatherData, setWeatherData] = useState<Weather[]>([]);

  const handleRemoveWeather = async (place: string) => {
    const newWeatherData = weatherData.map((weather) => {
      if (weather.place === place) {
        return { ...weather, deleted: true };
      }
      return weather;
    });

    setWeatherData(newWeatherData);

    try {
      const response = await fetch(
        `http://localhost:3999/${encodeURI(place)}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      setWeatherData(data.data);
    } catch (error) {
      console.error("Error removing data from server:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3999");
        const data = await response.json();
        setWeatherData(data.data);
      } catch (error) {
        console.error("Error fetching data from server:", error);
      }
    };

    fetchData();
  }, []);

  const createWeatherItem = async (weather: Weather) => {
    try {
      const response = await fetch("http://localhost:3999", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(weather),
      });

      if (response.status === 201) {
        const data = await response.json();
        setWeatherData(data.data);
        console.log("Weather item added to server");
      }
    } catch (error) {
      console.error("Error adding data to server:", error);
    }
  };

  return (
    <Layout>
      <Title title={"Velkommen til oversikten over været"} />
      <StaticText />
      <WeatherTable
        weatherData={weatherData}
        handleRemoveWeather={handleRemoveWeather}
      />
      <Form createWeatherItem={createWeatherItem} />
    </Layout>
  );
}

export default App;
