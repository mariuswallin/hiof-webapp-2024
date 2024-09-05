import { readFile, writeFile } from "node:fs/promises";
import type { Weather } from "./types";

export async function getWeatherData() {
  const data = await readFile("./data/weather.json", "utf-8");
  const parsedData = JSON.parse(data) as Weather[];
  return parsedData;
}

export async function updateWeatherData(newData: Weather[]) {
  await writeFile("./data/weather.json", JSON.stringify(newData));
}
