import "../styles/global.css";

import { state } from "./state/state.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[AuQMia] boot", state.ui);
});
