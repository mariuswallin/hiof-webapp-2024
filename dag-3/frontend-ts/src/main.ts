import "./style.css"

//async function loadWeatherData() {}
const loadWeatherData = async () => {
  const response = await fetch("http://localhost:3999", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  console.log(response.status)
  console.log(response.ok)

  const data = await response.json()

  // data.data fordi jeg vet at dataen jeg får tilbake er i et objekt som heter data
  console.log(data.data)
  const jsonId = document.getElementById("json")
  if (jsonId) {
    jsonId.innerHTML = JSON.stringify(data.data, null, 2)
  }
}

const addWeatherData = async (weather: unknown) => {
  try {
    const response = await fetch("http://localhost:3999", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // hvis body inneholder noe funksjoner ellerno blir det gjort til string så kan serveren evt håndtere den hvis den ønsker. Alt blir da til string før den sendes til serveren (hono).
      body: JSON.stringify(weather),
    })
    console.log(response.status)
    console.log(response.ok)

    const data = await response.json()
    // console.log()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

// mer fleksible måte å hente ut elementer fra html
// hvis en p, så hadde det stått p, hvis en div, så hadde det stått div osv.
// kastet som en htmlformelement, så hvis selectoren var en p, så hadde denne feilet, så dette er en tryggere måte å hente ut elementer fra html.
const form = document.querySelector("form") as HTMLFormElement
form.addEventListener("submit", async (event) => {
  // default er GET, så jeg ønsker ikke at den skal gjøre dette som browseren by default ønsker å gjøre. Viktig å ha med.
  event.preventDefault()
  const place = (form.elements.namedItem("place") as HTMLInputElement)?.value
  const today = (form.elements.namedItem("today") as HTMLInputElement)?.value
  const tomorrow = (form.elements.namedItem("tomorrow") as HTMLInputElement)
    ?.value

  try {
    await addWeatherData({ place, today, tomorrow })
  } catch (error) {
    console.error(error)
  }
})

loadWeatherData()
