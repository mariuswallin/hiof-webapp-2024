console.log("Script loading json load.js");

function loadFromJSON() {
  fetch("public/data.json")
    .then((response) => {
      // Konverterer data til json format
      return response.json();
    })
    .then((data) => {
      // Henter ut div med id `data`
      const dataId = document.getElementById("data");
      // Debugging
      console.log(data);
      // Går igjennom dataen og lager en `p` til hvert element.
      for (const habit of data) {
        const element = document.createElement("p");
        // Legger til verdien koblet til `title` nøkkelen i .json filen
        element.textContent = `${habit.title}`;
        // Legger innholdet til div-en
        dataId.appendChild(element);
      }
    });
}

loadFromJSON();
