import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// On a supprimé l'import du CSS qui n'existe pas
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);