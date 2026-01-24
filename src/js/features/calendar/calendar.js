import { addMonths, getMonthGrid } from "../../../utils/calendar.js";

function reduceCalendar(prevState, action) {
  const cal = prevState.ui.calendar;

  switch (action.type) {
    case "CAL_PREV": {
      const next = addMonths(cal.year, cal.month, -1);
      return {
        ...prevState,
        ui: { ...prevState.ui, calendar: { ...cal, ...next } },
      };
    }

    case "CAL_NEXT": {
      const next = addMonths(cal.year, cal.month, 1);
      return {
        ...prevState,
        ui: { ...prevState.ui, calendar: { ...cal, ...next } },
      };
    }

    case "CAL_SELECT_DATE": {
      return {
        ...prevState,
        ui: {
          ...prevState.ui,
          calendar: { ...cal, selectedDateISO: action.payload.dateISO },
        },
      };
    }

    default:
      return prevState;
  }
}

function monthLabelPT(monthIndex) {
  const names = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return names[monthIndex];
}

function buildDotsForDate(state, dateISO) {
  const appts = state.data.appointments || [];
  const onDay = appts.filter((a) => a.dateISO === dateISO);

  const hasDog = onDay.some((a) => a.petType === "dog");
  const hasCat = onDay.some((a) => a.petType === "cat");

  return { hasDog, hasCat };
}

export function initCalendar(store) {
  const monthEl = document.querySelector("[data-calendar-month]");
  const yearEl = document.querySelector("[data-calendar-year]");
  const gridEl = document.querySelector("[data-calendar-grid]");
  const countEl = document.querySelector("[data-calendar-count]");

  if (!monthEl || !yearEl || !gridEl) return;

  function dispatch(action) {
    store.update((s) => reduceCalendar(s, action));
  }

  function render(state) {
    const { year, month, selectedDateISO } = state.ui.calendar;

    monthEl.textContent = monthLabelPT(month);
    yearEl.textContent = String(year);
    if (countEl) {
      const count = (state.data.appointments || []).filter((a) => {
        const [y, m] = a.dateISO.split("-").map(Number);
        return y === year && m === month + 1;
      }).length;
      countEl.textContent = String(count);
    }

    const cells = getMonthGrid(year, month);
    gridEl.innerHTML = "";

    const todayISO = state.ui.calendar.selectedDateISO ? null : null;
    const actualTodayISO = (() => {
      const d = new Date();
      const pad2 = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    })();

    cells.forEach((c) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "calendar__day";
      btn.dataset.date = c.dateISO;
      btn.setAttribute("role", "gridcell");

      if (!c.inMonth) {
        btn.setAttribute("aria-disabled", "true");
        btn.disabled = true;
      }

      if (c.dateISO === selectedDateISO) {
        btn.classList.add("calendar__day--selected");
      }

      if (c.dateISO === actualTodayISO) {
        btn.classList.add("calendar__day--today");
      }

      btn.textContent = String(c.day);

      const { hasDog, hasCat } = buildDotsForDate(state, c.dateISO);
      if (hasDog || hasCat) {
        const dots = document.createElement("div");
        dots.className = "calendar__dots";

        if (hasDog) {
          const d = document.createElement("span");
          d.className = "calendar__dot calendar__dot--dog";
          d.setAttribute("aria-hidden", "true");
          dots.appendChild(d);
        }
        if (hasCat) {
          const d = document.createElement("span");
          d.className = "calendar__dot calendar__dot--cat";
          d.setAttribute("aria-hidden", "true");
          dots.appendChild(d);
        }

        btn.appendChild(dots);
      }

      gridEl.appendChild(btn);
    });
  }

  render(store.getState());
  store.subscribe(render);

  document.addEventListener("click", (e) => {
    const actionEl = e.target.closest("[data-action]");
    if (actionEl) {
      const a = actionEl.dataset.action;
      if (a === "calendar-prev") dispatch({ type: "CAL_PREV" });
      if (a === "calendar-next") dispatch({ type: "CAL_NEXT" });
    }

    const dayEl = e.target.closest(".calendar__day[data-date]");
    if (dayEl && !dayEl.disabled) {
      const dateISO = dayEl.dataset.date;
      store.update((prev) => {
        const withDate = reduceCalendar(prev, {
          type: "CAL_SELECT_DATE",
          payload: { dateISO },
        });
        return {
          ...withDate,
          ui: {
            ...withDate.ui,
            modals: { ...withDate.ui.modals, calendarOpen: false },
          },
        };
      });
    }
  });
}
