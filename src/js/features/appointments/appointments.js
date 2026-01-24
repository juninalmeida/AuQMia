import { makeId } from "../../../utils/ids.js";
import { validateAppointment } from "../../../utils/validators.js";

function getPeriod(timeHHMM) {
  const [hh] = timeHHMM.split(":").map(Number);
  if (hh < 12) return "morning";
  if (hh < 18) return "afternoon";
  return "night";
}

function sortByTime(a, b) {
  return a.time.localeCompare(b.time);
}

function getCalendarFromISO(dateISO) {
  const [yearStr, monthStr] = dateISO.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;

  return { year, month, selectedDateISO: dateISO };
}

function reduceAppointments(prevState, action) {
  if (action.type !== "ADD_APPOINTMENT") return prevState;

  const nextAppointments = [
    ...prevState.data.appointments,
    action.payload.appointment,
  ];

  return {
    ...prevState,
    data: { ...prevState.data, appointments: nextAppointments },
  };
}

function clearEl(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function renderEmpty(listEl, label) {
  const li = document.createElement("li");
  li.className = "empty-state";
  li.textContent = `Sem agendamentos (${label})`;
  listEl.appendChild(li);
}

function renderCard(appt) {
  const li = document.createElement("li");
  li.className = "appt-card";

  const top = document.createElement("div");
  top.className = "appt-card__top";

  const title = document.createElement("strong");
  title.className = "appt-card__pet";
  title.textContent = appt.petName;

  const time = document.createElement("span");
  time.className = "appt-card__time";
  time.textContent = appt.time;

  top.append(title, time);

  const sub = document.createElement("div");
  sub.className = "appt-card__sub";
  sub.textContent = appt.ownerName;

  const svc = document.createElement("div");
  svc.className = "appt-card__svc";
  svc.textContent = appt.service;

  li.append(top, sub, svc);
  return li;
}

function renderDaily(state) {
  const selectedDateISO = state.ui.calendar.selectedDateISO;

  const slots = {
    morning: document.querySelector('[data-slot="morning"]'),
    afternoon: document.querySelector('[data-slot="afternoon"]'),
    night: document.querySelector('[data-slot="night"]'),
  };

  if (!slots.morning || !slots.afternoon || !slots.night) return;

  Object.values(slots).forEach(clearEl);

  const todays = state.data.appointments
    .filter((a) => a.dateISO === selectedDateISO)
    .slice()
    .sort(sortByTime);

  const grouped = { morning: [], afternoon: [], night: [] };
  todays.forEach((a) => grouped[getPeriod(a.time)].push(a));

  if (!grouped.morning.length) renderEmpty(slots.morning, "manhã");
  else grouped.morning.forEach((a) => slots.morning.appendChild(renderCard(a)));

  if (!grouped.afternoon.length) renderEmpty(slots.afternoon, "tarde");
  else
    grouped.afternoon.forEach((a) =>
      slots.afternoon.appendChild(renderCard(a)),
    );

  if (!grouped.night.length) renderEmpty(slots.night, "noite");
  else grouped.night.forEach((a) => slots.night.appendChild(renderCard(a)));
}

export function initAppointments(store) {
  const modalNew = document.getElementById("modal-new");
  const form = modalNew?.querySelector("form.form");
  if (!form) return;

  const submitIcon = form.querySelector("[data-submit-icon]");
  const submitButton = form.querySelector(".form__submit");

  const FIELDS = [
    "petType",
    "petName",
    "ownerName",
    "service",
    "time",
    "dateISO",
  ];

  function renderFormErrors(errors) {
    const errorEls = form.querySelectorAll("[data-error-for]");
    errorEls.forEach((el) => {
      const key = el.getAttribute("data-error-for");
      el.textContent = errors[key] || "";
    });
  }

  function setInvalid(field, isInvalid) {
    const target =
      field === "petType"
        ? form.querySelector('[data-field="petType"]')
        : form.elements?.[field];

    if (!target || typeof target.setAttribute !== "function") return;

    if (isInvalid) target.setAttribute("aria-invalid", "true");
    else target.removeAttribute("aria-invalid");
  }

  function closeAllModals(nextState) {
    return {
      ...nextState,
      ui: {
        ...nextState.ui,
        modals: { calendarOpen: false, newAppointmentOpen: false },
      },
    };
  }

  function updateCalendar(nextState, dateISO) {
    return {
      ...nextState,
      ui: {
        ...nextState.ui,
        calendar: {
          ...nextState.ui.calendar,
          ...getCalendarFromISO(dateISO),
        },
      },
    };
  }

  function dispatchAdd(appointment) {
    store.update((prev) => {
      const withAppt = reduceAppointments(prev, {
        type: "ADD_APPOINTMENT",
        payload: { appointment },
      });
      const withCalendar = updateCalendar(withAppt, appointment.dateISO);
      return closeAllModals(withCalendar);
    });
  }

  function render(state) {
    renderDaily(state);

    if (state.ui.modals.newAppointmentOpen) {
      const dateInput = form.elements?.dateISO;
      if (dateInput && !dateInput.value) {
        dateInput.value = state.ui.calendar.selectedDateISO;
      }
    }
  }

  function updateSubmitIcon() {
    const selected = form.querySelector('input[name="petType"]:checked');
    const icon = selected?.dataset?.icon;
    const petType = selected?.value;

    if (submitButton) {
      submitButton.classList.remove(
        "form__submit--dog",
        "form__submit--cat",
      );
      if (petType === "dog") submitButton.classList.add("form__submit--dog");
      if (petType === "cat") submitButton.classList.add("form__submit--cat");
    }

    if (!submitIcon) return;

    if (!icon) {
      submitIcon.hidden = true;
      submitIcon.removeAttribute("icon");
      return;
    }

    submitIcon.setAttribute("icon", icon);
    submitIcon.hidden = false;
  }

  render(store.getState());
  store.subscribe(render);

  updateSubmitIcon();

  form.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.name !== "petType") return;
    updateSubmitIcon();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const fd = new FormData(form);
    const draft = {
      petType: String(fd.get("petType") || ""),
      petName: String(fd.get("petName") || ""),
      ownerName: String(fd.get("ownerName") || ""),
      service: String(fd.get("service") || ""),
      time: String(fd.get("time") || ""),
      dateISO: String(
        fd.get("dateISO") || store.getState().ui.calendar.selectedDateISO || "",
      ),
    };

    const { ok, errors } = validateAppointment(draft);

    if (!ok) {
      renderFormErrors(errors);
      Object.keys(errors).forEach((field) => setInvalid(field, true));
      return;
    }

    renderFormErrors({});
    FIELDS.forEach((f) => setInvalid(f, false));

    const appointment = { id: makeId(), ...draft };

    dispatchAdd(appointment);
    form.reset();
    updateSubmitIcon();
  });
}
