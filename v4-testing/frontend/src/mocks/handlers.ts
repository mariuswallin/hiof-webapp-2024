import { http, HttpResponse } from "msw";

export const handlers = [
  // Intercept POST requests til /api/users ...
  http.post("http://localhost:1337/api/authenticate/login", () => {
    // ...og returnerer en JSON-respons
    return HttpResponse.json({
      id: "c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d",
      firstName: "Ola",
      lastName: "Dunk",
    });
  }),
];
