console.log("Loaded defer index.js");

document
  .getElementById("add-habit-button")
  .addEventListener("click", () => {
    // Hente verdien fra input-feltet
    const habitInput = document.getElementById("new-habit-input");
    const habitText = habitInput.value;
    if (!habitText) return;

    // Opprett et nytt <li>-element for vanen
    const newHabit = document.createElement("li");
    newHabit.textContent = `${habitText} - Streak: 0`;

    // Append det nye vanen til habit-list
    document.getElementById("habit-list").appendChild(newHabit);

    // Tøm input-feltet
    habitInput.value = "";
  });

document
  .getElementById("habit-list")
  .addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
      // Hente ut tekstinnholdet og splitte det for å få streak-nummeret
      const habitText = event.target.textContent;
      const parts = habitText.split(" - Streak: ");
      const streak = Number.parseInt(parts[1]) + 1;

      // Oppdatere tekstinnholdet med ny streak
      event.target.textContent = `${parts[0]} - Streak: ${streak}`;
    }
  });

// Funksjon for å lagre vaner i LocalStorage
function saveHabits() {
  const habits = [];
  // Finner alle li elementer som er barn av `habit-list`
  const habitLiElements = document.querySelectorAll("#habit-list li");

  for (const element of habitLiElements) {
    habits.push(element.textContent);
  }

  localStorage.setItem("habits", JSON.stringify(habits));
}

// Funksjon for å laste vaner fra LocalStorage
function loadHabits() {
  // Henter vaner fra localStorage. Må parse dette da dataen vi får er streng
  const habits = JSON.parse(window.localStorage.getItem("habits")) || [];
  // Til debugging
  console.log(habits);

  // Går igjennom listen med vaner
  for (const habit of habits) {
    // Lager nytt li element
    const newHabit = document.createElement("li");
    // Legger til tekst på elementet
    newHabit.textContent = habit;
    // Legger elementet til listen med id `habit-list`
    document.getElementById("habit-list").appendChild(newHabit);
  }
}

const habitsBtn = document.getElementById("add-habit-button");

habitsBtn.addEventListener("click", () => {
  habitsBtn.style.backgroundColor = "red";
});

// Event listeners for å lagre vaner når de oppdateres eller legges til
document
  .getElementById("add-habit-button")
  .addEventListener("click", saveHabits);

// Legger til ekstra lytter for å oppdatere localStorage
document.getElementById("habit-list").addEventListener("click", saveHabits);

// Last lagrede vaner når siden lastes
loadHabits();
