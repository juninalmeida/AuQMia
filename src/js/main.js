import "../styles/app.css";

import { state as initialState } from "./state/state.js";
import { createStore } from "./state/store.js";
import { initModals } from "./features/modals/modals.js";

const store = createStore(initialState);

document.addEventListener("DOMContentLoaded", () => {
  initModals(store);
});
