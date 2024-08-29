import "./style.css";

const fetchDataFromServer = async () => {
  const response = await fetch("http://localhost:3999/json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();

  console.log(result);

  const id = document.getElementById("json");
  if (!id) return;
  // id.innerHTML = result;
  for (const habit of result) {
    const element = document.createElement("p");
    element.textContent = habit.title;
    id.appendChild(element);
  }
};

fetchDataFromServer();
