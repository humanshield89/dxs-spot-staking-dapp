import React from "react";
import ReactDOM from "react-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import App from "./App";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
