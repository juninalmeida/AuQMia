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

const SERVICE_META = {
  banho: { label: "Banho", icon: "solar:bath-linear" },
  tosa_completa: { label: "Tosa Completa", icon: "solar:scissors-linear" },
  tosa_higienica: { label: "Tosa Higiênica", icon: "solar:scissors-linear" },
  hidratacao: { label: "Hidratação", icon: "solar:bath-linear" },
  unhas: { label: "Corte de Unhas", icon: "solar:scissors-linear" },
  ouvido: { label: "Limpeza de Ouvido", icon: "solar:syringe-linear" },
};

function getServiceMeta(service) {
  if (SERVICE_META[service]) return SERVICE_META[service];
  return { label: service, icon: "solar:scissors-linear" };
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
  li.className = `appt-card appt-card--${appt.petType || "dog"}`;

  const top = document.createElement("div");
  top.className = "appt-card__top";

  const identity = document.createElement("div");
  identity.className = "appt-card__identity";

  const avatar = document.createElement("div");
  avatar.className = `appt-card__avatar appt-card__avatar--${appt.petType || "dog"}`;

  const petIcon = document.createElement("iconify-icon");
  petIcon.setAttribute(
    "icon",
    appt.petType === "cat" ? "solar:cat-linear" : "solar:dog-linear",
  );
  petIcon.setAttribute("aria-hidden", "true");
  petIcon.className = "appt-card__avatar-icon";
  avatar.appendChild(petIcon);

  const identityText = document.createElement("div");

  const title = document.createElement("h3");
  title.className = "appt-card__pet";
  title.textContent = appt.petName;

  const owner = document.createElement("p");
  owner.className = "appt-card__owner";
  owner.textContent = appt.ownerName;

  identityText.append(title, owner);
  identity.append(avatar, identityText);

  const time = document.createElement("span");
  time.className = "appt-card__time";
  time.textContent = appt.time;

  top.append(identity, time);

  const footer = document.createElement("div");
  footer.className = "appt-card__footer";

  const service = document.createElement("div");
  service.className = "appt-card__service";

  const serviceMeta = getServiceMeta(appt.service);
  const serviceIcon = document.createElement("iconify-icon");
  serviceIcon.setAttribute("icon", serviceMeta.icon);
  serviceIcon.setAttribute("aria-hidden", "true");
  serviceIcon.className = "appt-card__service-icon";

  const serviceLabel = document.createElement("span");
  serviceLabel.className = "appt-card__service-label";
  serviceLabel.textContent = serviceMeta.label;

  service.append(serviceIcon, serviceLabel);

  const actions = document.createElement("div");
  actions.className = "appt-card__actions";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "appt-card__action";
  editBtn.setAttribute("aria-label", "Editar");

  const editIcon = document.createElement("iconify-icon");
  editIcon.setAttribute("icon", "solar:pen-linear");
  editIcon.setAttribute("aria-hidden", "true");
  editBtn.appendChild(editIcon);

  actions.appendChild(editBtn);
  footer.append(service, actions);

  li.append(top, footer);
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
