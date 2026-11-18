import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./i18n.js";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/dashboard.css";
import "./styles/responsive.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);