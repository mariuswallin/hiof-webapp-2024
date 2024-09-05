export type WeatherType = "rain" | "sun" | "cloudy";

export type Weather = {
  id?: string;
  place: string;
  tomorrow: WeatherType;
  today: WeatherType;
  deleted?: boolean;
  description?: string;
};
