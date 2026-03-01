import "./theme.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./readiness-assessment/readiness-assessment";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
