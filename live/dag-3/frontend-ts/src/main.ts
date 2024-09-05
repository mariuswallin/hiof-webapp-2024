import "./style.css";

// async function loadWeatherData() {}
const loadWeatherData = async () => {
  const response = await fetch("http://localhost:3999", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  console.log(response.status);
  console.log(response.ok);

  const data = await response.json();
  console.log(data.data);
  const jsonId = document.getElementById("json");
  if (jsonId) jsonId.innerHTML = JSON.stringify(data.data, null, 2);
};

const addWeatherData = async (weather: unknown) => {
  try {
    const response = await fetch("http://localhost:3999", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(weather),
    });

    console.log(response.status);
    console.log(response.ok);
    const data = await response.json();
    console.log(data);
    loadWeatherData();
  } catch (error) {
    console.error(error);
  }
};

const form = document.querySelector("form") as HTMLFormElement;
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const place = (form.elements.namedItem("place") as HTMLInputElement)?.value;
  const today = (form.elements.namedItem("today") as HTMLInputElement)?.value;
  const tomorrow = (form.elements.namedItem("tomorrow") as HTMLInputElement)
    ?.value;
  try {
    await addWeatherData({ place, tomorrow, today });
  } catch (error) {
    console.error(error);
  }
});

loadWeatherData();
