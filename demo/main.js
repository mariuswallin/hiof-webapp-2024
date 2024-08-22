document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:3999/habits", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const habitList = document.getElementById("habit-list");
      for (const habit of data) {
        const listItem = document.createElement("li");
        listItem.textContent = `${habit.title}`;
        habitList.appendChild(listItem);
      }

    });
});
