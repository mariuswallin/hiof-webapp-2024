import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { getWeatherData, updateWeatherData } from "./lib"
import { Weather } from "./types"

const app = new Hono()

app.use(
  cors({
    origin: "*",
  })
)

app.get("/", async (c) => {
  const data = await getWeatherData()
  return c.json({ data })
})

app.get("/:place", async (c) => {
  const reqPlace = c.req.param("place") // henter ut place fra requesten som kommer inn
  const data = await getWeatherData()
  // sjekker om place finnes i listen i dataen som kommer fra getWeatherData funksjonen i lib.ts filen
  const existing = data.find(
    (entry) => entry.place.toLowerCase() === reqPlace.toLowerCase()
  )
  // hvis place ikke finnes, så returnerer vi en feilmelding med status 404
  if (!existing) return c.json({ error: "Place not found" }, 404)
  // hvis place finnes, så returnerer vi dataen som er i existing og place som er i requesten
  // data alene henter ut alle dataene.
  // e:existing er det som gjør at vi kun viste det vi ønsker å vise, og ikke alt som er i existing. Søker vi halden får vi alt relatert til halden.
  return c.json({ data: existing, param: reqPlace })
})

app.post("/", async (c) => {
  // c.req er fra hono rammeverket og henter ut dataen som er i bodyen til requesten
  // c.req.json kan gjøres generic ved å legge til weather type check.
  // const body = await c.req.json() // gammel var slik, før gjort generic med type check under <Weather>
  const body = await c.req.json<Weather>()
  // liten validering, viktig mtp sikkerhet
  if (!body.place) return c.json({ error: "Missing place" }, 400)
  const data = await getWeatherData()
  const hasPlace = data.some(
    (entry) => entry.place.toLowerCase() === body.place.toLowerCase()
  )
  if (hasPlace) return c.json({ error: "Place already exists" }, 409)
  // pusher til listen. body er det som kommer fra requesten
  data.push(body)
  await updateWeatherData(data)
  return c.json({ body }, 201)
})

// app.get("/", async (c) => {
//   const readFile = await fs.readFile(
//     "/hiof-webapp-2024/dag-3/backend/data/weather.json",
//     "utf8"
//   )
//   const data = JSON.parse(readFile)
//   return c.json({ data })
// })

const port = 3999

console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
