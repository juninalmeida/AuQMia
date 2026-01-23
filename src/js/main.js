import "../styles/app.css";

import { state as initialState } from "./state/state.js";
import { createStore } from "./state/store.js";
import { initModals } from "./features/modals/modals.js";
import { initCalendar } from "./features/calendar/calendar.js";

const store = createStore(initialState);

document.addEventListener("DOMContentLoaded", () => {
  initModals(store);
  initCalendar(store);
});
