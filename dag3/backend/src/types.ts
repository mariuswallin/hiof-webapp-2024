export type Weather = {
  place: string;
  tomorrow: "rain" | "sun" | "cloudy";
  today: "rain" | "sun" | "cloudy";
  deleted?: boolean;
  description?: string;
};

export type ToWeatherDomain = Weather & { deleted?: "true" };
