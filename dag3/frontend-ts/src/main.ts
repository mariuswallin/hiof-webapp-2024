import "./style.css";

const loadData = async () => {
  try {
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
  } catch (error) {
    console.error("Error fetching data from server:", error);
  }
};

const addData = async (weather: unknown) => {
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
    loadData();
  } catch (error) {
    console.error("Error adding data to server:", error);
    throw error;
  }
};

// const deleteData = async (id: string) => {
//   try {
//     const response = await fetch(`http://localhost:3999/${id}`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const data = await response.json();
//     console.log(response.status);
//     console.log(response.ok);
//     console.log(data);
//     loadData();
//   } catch (error) {
//     console.error("Error deleting data from server:", error);
//   }
// };

const form = document.querySelector("form") as HTMLFormElement;
form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();
  const place = (form.elements.namedItem("place") as HTMLInputElement)?.value;
  const tomorrow = (form.elements.namedItem("tomorrow") as HTMLInputElement)
    ?.value;
  const today = (form.elements.namedItem("today") as HTMLInputElement)?.value;

  try {
    await addData({ place, tomorrow, today });
  } catch (error) {
    alert(JSON.stringify(error));
  }
});

loadData();
