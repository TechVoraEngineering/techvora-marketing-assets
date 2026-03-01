import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LegacyCostCalculator from "./legacycostcalculator/legacy-cost-calculator";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LegacyCostCalculator />
  </StrictMode>
);
