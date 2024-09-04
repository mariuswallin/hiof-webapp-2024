import { readFile, writeFile } from "node:fs/promises";
import type { ToDomainParams, Weather } from "./types";

export async function getParsedData() {
  const data = await readFile("./data/weather.json", "utf-8");
  const parsedData = JSON.parse(data) as ToDomainParams[];
  return parsedData.map(toDomain);
}

export async function updateWeatherData(newData: Weather[]) {
  const data = newData.map(weatherToJSON);
  await writeFile("./data/weather.json", JSON.stringify(data, null, 2));
}

export function weatherToJSON(data: Weather) {
  return {
    ...data,
    ...(data.deleted && { deleted: "true" }),
  };
}

export function toDomain(data: Weather & { deleted?: "true" }) {
  return {
    ...data,
    ...(data.deleted === "true" && { deleted: true }),
  };
}
