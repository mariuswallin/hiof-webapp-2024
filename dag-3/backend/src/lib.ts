// funksjoner vi skal bruke over alt i applikasjonen, samler vi her.

import { readFile, writeFile } from "node:fs/promises"
import { Weather } from "./types"

// async function fordi jeg skal vente på en promise (fremtidig verdig som jeg ikke har enda, ukjent)
export async function getWeatherData() {
  const data = await readFile("./data/weather.json", "utf8")

  ///hiof-webapp-2024/dag-3/backend/data/weather.json
  // JSON.parse gjør at dataen blir leselig for oss
  const parsedData = JSON.parse(data) as Weather[] // Hvis vi endrer nooe i types.ts, så vil denne linjen feile, fordi vi har endret på dataen som kommer inn. Derfor er det viktig å ha en type på dataen som kommer inn.
  return parsedData
}

// Insteaad for
// export async function updateWeatherData(newData: unknown)
// kan vi sette inn type: weather og importere Weather fra types.ts
// Weather MÅ nå benytte seg av Weather type fra types.ts og ikke en hvilken som helst type som tidligere "unknown"
export async function updateWeatherData(newData: Weather[]) {
  await writeFile("./data/weather.json", JSON.stringify(newData))
}
