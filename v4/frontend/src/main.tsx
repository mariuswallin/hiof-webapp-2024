import "./styles/index.css";
// import "./styles/tailwind.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import HabitPage from "./features/habits/pages/index.tsx";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App>
      <HabitPage />
    </App>
  </React.StrictMode>
);
