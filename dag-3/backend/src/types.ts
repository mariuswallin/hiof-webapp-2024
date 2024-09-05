// Definerer en type for værdata, brukes for å definere hva slags data vi forventer å få tilbake fra serveren
// dette er viktig fordi vi validerer dataen vi får tilbake fra serveren.

// Den må være enten rain, sun eller cloudy
export type WeatherType = "rain" | "sun" | "cloudy"

export type Weather = {
  // how to make place unique in the array
  id?: string
  place: string
  tomorrow: WeatherType
  today: WeatherType
  //. ? betyr at feltet er optional, trenger ikke å være med. Alt som ikke har ? må sendes med, eller feiler den.
  deleted?: boolean
  description?: string
}
