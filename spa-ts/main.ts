import { z } from "zod";
import { HabitArraySchema, type Habit } from "./types";

const form = document.getElementById("habitForm") as HTMLFormElement;
const habitsList = document.getElementById("habitsList") as HTMLUListElement;
const habits: Habit[] = [];

form.addEventListener("submit", async (event: SubmitEvent) => {
  event.preventDefault();

  const newHabit = {
    id: crypto.randomUUID(),
    title: (
      (event.target as HTMLFormElement).elements.namedItem(
        "title"
      ) as HTMLInputElement
    )?.value,
    createdAt: new Date(),
  };

  habits.push(newHabit);
  updateHabitsList();

  try {
    const response = await fetch("http://localhost:3999/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHabit),
    });

    if (response.status === 201) {
      console.log("Vane lagret på serveren");
    } else {
      console.error("Feil ved lagring av vane på serveren");
    }
  } catch (error) {
    console.error("Feil ved sending av data til serveren:", error);
  }
});

function updateHabitsList() {
  console.log(habits);
  if (!habitsList) return;
  habitsList.innerHTML = "";

  for (const habit of habits) {
    const listItem = document.createElement("li");
    listItem.textContent = `${habit.title} - ${new Date(
      habit.createdAt
    ).toLocaleDateString()}`;
    habitsList.appendChild(listItem);
  }
}

function loadFromApi() {
  fetch("http://localhost:3999")
    .then((response) => response.json())
    .then((data: unknown) => {
      try {
        // Forsøker å parse og validere dataene med Zod-skjemaet
        const validatedHabits = HabitArraySchema.parse(data);

        habits.push(...validatedHabits); // Legger til validerte vaner i den interne listen
        updateHabitsList(); // Oppdaterer visningen på nettsiden
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Ugyldig data mottatt fra serveren:", error.errors);
        } else {
          console.error("Uventet feil ved validering av data:", error);
        }
      }
    })
    .catch((error: Error) => {
      console.error("Feil ved henting av data fra serveren:", error);
    });
}

loadFromApi();
