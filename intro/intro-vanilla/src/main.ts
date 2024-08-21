import "./style.css";

const rootId = document.getElementById("app");

function welcome(name: string, age: number) {
  const welcomeElement = document.createElement("div");
  welcomeElement.innerHTML = `<h1>Velkommen, ${name}!</h1><p>Alder: ${age}</p>`;
  return welcomeElement;
}

const createIfnotExist = (id: string, tag = "div") => {
  let element = document.getElementById(id);
  if (element) return element;
  element = document.createElement(tag);
  element.id = id;
  return element;
};

function displayStreaks(streaks: { habit: string; streaks: number }[]) {
  const streaksElement = createIfnotExist("streaks", "div");

  for (const streak of streaks) {
    const streakElement = document.createElement("p");
    streakElement.textContent = `Habit: ${streak.habit}, Streaks: ${streak.streaks}`;
    streaksElement.appendChild(streakElement);
    const updateButton = createUpdateButton(streaks, streak);
    streaksElement.appendChild(updateButton);
  }

  return streaksElement;
}

function cleanStreaks() {
  const streaksElement = document.getElementById("streaks");
  if (streaksElement) {
    streaksElement.innerHTML = "";
  }
}

function createHabitForm() {
  const form = document.createElement("form");
  form.id = "form";
  form.method = "post";
  form.action = "#";
  const input = document.createElement("input");
  input.type = "text";
  input.name = "habit";
  input.placeholder = "Habit";
  form.appendChild(input);
  const button = document.createElement("button");
  button.type = "submit";
  button.textContent = "Legg til vane";
  form.appendChild(button);
  return form;
}

function createHabitListAnchor() {
  return createIfnotExist("habits", "ul");
}

function updateHabitList(title: string) {
  const habitListWrapper = document.getElementById("habits");

  if (!habitListWrapper) return;

  const habits = [
    ...Array.from(habitListWrapper.querySelectorAll("li span") ?? []).map(
      (li) => li.textContent
    ),
    title,
  ];

  habitListWrapper.innerHTML = "";

  for (const habit of habits) {
    const habitListElement = document.createElement("li");
    const habitTextElement = document.createElement("span");
    const removeButton = document.createElement("button");

    habitTextElement.textContent = habit;
    removeButton.textContent = "[-]";
    removeButton.addEventListener("click", () => {
      habitListElement.remove();
    });
    habitListElement.appendChild(habitTextElement);
    habitListElement.appendChild(removeButton);
    habitListWrapper.appendChild(habitListElement);
  }
}

function setFormListener(id: string) {
  const form = document.getElementById(id);

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    if (!input) return;
    updateHabitList(input.value);
  });
}

function calculateTotalStreaks(streaks: { habit: string; streaks: number }[]) {
  let total = 0;
  for (const streak of streaks) {
    total += streak.streaks;
  }
  return total;
}

function updateStreak(
  streaks: { habit: string; streaks: number }[],
  streak: { habit: string; streaks: number }
) {
  const updatedStreaks = streaks.map((s) => {
    if (s.habit === streak.habit) {
      return { ...s, streaks: s.streaks + 1 };
    }
    return s;
  });

  cleanStreaks();
  displayStreaks(updatedStreaks);
  displayTotalStreaks(calculateTotalStreaks(updatedStreaks));
}

function createUpdateButton(
  streaks: { habit: string; streaks: number }[],
  streak: { habit: string; streaks: number }
) {
  const button = document.createElement("button");
  button.textContent = "Update Streak";
  button.onclick = () => updateStreak(streaks, streak);
  return button;
}

function displayTotalStreaks(total: number) {
  const totalElement = createIfnotExist("total", "p");
  totalElement.textContent = `Total Streaks: ${total}`;
  return totalElement;
}

function app() {
  const name = "Alfred";
  const age = 20;

  const streaks = [
    { habit: "Lese", streaks: 10 },
    { habit: "Løpe", streaks: 5 },
  ];

  const totalStreaks = calculateTotalStreaks(streaks);

  const mainElement = document.createElement("main");
  mainElement.appendChild(welcome(name, age));
  mainElement.appendChild(displayStreaks(streaks));
  mainElement.appendChild(displayTotalStreaks(totalStreaks));
  mainElement.appendChild(createHabitForm());
  mainElement.appendChild(createHabitListAnchor());

  rootId?.appendChild(mainElement);

  setFormListener("form");
}

app();
