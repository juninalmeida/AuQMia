const TRANSITION_MS = 300;

function reduceModals(prevState, action) {
  const prev = prevState.ui.modals;

  switch (action.type) {
    case "OPEN_CALENDAR":
      return {
        ...prevState,
        ui: {
          ...prevState.ui,
          modals: {
            calendarOpen: true,
            newAppointmentOpen: false,
          },
        },
      };

    case "OPEN_NEW":
      return {
        ...prevState,
        ui: {
          ...prevState.ui,
          modals: {
            calendarOpen: false,
            newAppointmentOpen: true,
          },
        },
      };

    case "CLOSE_ALL":
      return {
        ...prevState,
        ui: {
          ...prevState.ui,
          modals: {
            calendarOpen: false,
            newAppointmentOpen: false,
          },
        },
      };

    default:
      return prevState;
  }
}

export function initModals(store) {
  const overlay = document.querySelector("[data-overlay]");
  const modalCalendar = document.getElementById("modal-calendar");
  const modalNew = document.getElementById("modal-new");

  const hideTimers = new Map();
  let lastActiveEl = null;
  let prevOpenKey = null;

  function dispatch(action) {
    store.update((s) => reduceModals(s, action));
  }

  function setElOpen(el, open) {
    if (!el) return;

    const timer = hideTimers.get(el);
    if (timer) {
      clearTimeout(timer);
      hideTimers.delete(el);
    }

    if (open) {
      el.hidden = false;
      el.setAttribute("aria-hidden", "false");
      requestAnimationFrame(() => {
        el.dataset.open = "true";
      });
      return;
    }

    el.dataset.open = "false";
    el.setAttribute("aria-hidden", "true");
    const t = setTimeout(() => {
      el.hidden = true;
      hideTimers.delete(el);
    }, TRANSITION_MS);
    hideTimers.set(el, t);
  }

  function render(state) {
    const { calendarOpen, newAppointmentOpen } = state.ui.modals;
    const anyOpen = calendarOpen || newAppointmentOpen;

    setElOpen(overlay, anyOpen);

    setElOpen(modalCalendar, calendarOpen);
    setElOpen(modalNew, newAppointmentOpen);

    document
      .querySelectorAll('[data-action="open-calendar"]')
      .forEach((btn) =>
        btn.setAttribute("aria-expanded", String(calendarOpen)),
      );

    document
      .querySelectorAll('[data-action="open-new-appointment"]')
      .forEach((btn) =>
        btn.setAttribute("aria-expanded", String(newAppointmentOpen)),
      );

    const openKey = calendarOpen
      ? "calendar"
      : newAppointmentOpen
        ? "new"
        : null;

    if (openKey && openKey !== prevOpenKey) {
      const modal = openKey === "calendar" ? modalCalendar : modalNew;
      modal?.querySelector(".modal__close")?.focus();
    }

    if (!openKey && prevOpenKey) {
      lastActiveEl?.focus?.();
      lastActiveEl = null;
    }

    prevOpenKey = openKey;
  }

  render(store.getState());
  store.subscribe(render);

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;

    const action = el.dataset.action;

    if (action === "open-calendar") {
      lastActiveEl = document.activeElement;
      dispatch({ type: "OPEN_CALENDAR" });
    }

    if (action === "open-new-appointment") {
      lastActiveEl = document.activeElement;
      dispatch({ type: "OPEN_NEW" });
    }

    if (action === "close-all") {
      dispatch({ type: "CLOSE_ALL" });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;

    const { calendarOpen, newAppointmentOpen } = store.getState().ui.modals;
    if (calendarOpen || newAppointmentOpen) {
      dispatch({ type: "CLOSE_ALL" });
    }
  });

  document.addEventListener("submit", (e) => {
    const form = e.target.closest(".form");
    if (!form) return;
    e.preventDefault();
  });
}
