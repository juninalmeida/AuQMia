import { makeId } from "../../../utils/ids.js";
import { validateAppointment } from "../../../utils/validators.js";

const API_BASE = "/api";

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
  "bath-groom": { icon: "solar:bath-linear" },
  "vet-consult": { icon: "mdi:stethoscope" },
  vaccination: { icon: "solar:syringe-linear" },
  deworming: { icon: "mdi:pill" },
  "flea-tick": { icon: "mdi:bug" },
};

const serviceCatalog = {};

function getServiceMeta(serviceId) {
  if (SERVICE_META[serviceId]) return SERVICE_META[serviceId];
  return { icon: "solar:scissors-linear" };
}

function getCalendarFromISO(dateISO) {
  const [yearStr, monthStr] = dateISO.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;

  return { year, month, selectedDateISO: dateISO };
}

function reduceAppointments(prevState, action) {
  if (action.type !== "ADD_APPOINTMENT" && action.type !== "REMOVE_APPOINTMENT")
    return prevState;

  const nextAppointments =
    action.type === "ADD_APPOINTMENT"
      ? [...prevState.data.appointments, action.payload.appointment]
      : prevState.data.appointments.filter(
          (appointment) => appointment.id !== action.payload.id,
        );

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
    appt.petType === "cat" ? "solar:cat-linear" : "mdi:dog",
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
  serviceLabel.textContent =
    serviceCatalog[appt.service]?.label || appt.service || "Service";

  service.append(serviceIcon, serviceLabel);

  const actions = document.createElement("div");
  actions.className = "appt-card__actions";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "appt-card__action";
  editBtn.setAttribute("aria-label", "Delete");
  editBtn.dataset.action = "delete-appointment";
  editBtn.dataset.appointmentId = appt.id;

  const editIcon = document.createElement("iconify-icon");
  editIcon.setAttribute("icon", "solar:trash-bin-trash-linear");
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
  const serviceSelect = form.elements?.service;
  const dateInputEl = form.elements?.dateISO;
  const notice = document.querySelector("[data-notice]");
  const noticeMessage = notice?.querySelector("[data-notice-message]");
  let noticeTimer = null;
  let noticeCooldown = false;
  let noticeCooldownTimer = null;
  let noticeResetTimer = null;

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

  function clearInlineErrors() {
    renderFormErrors({});
    FIELDS.forEach((field) => setInvalid(field, false));
  }

  function closeNotice() {
    if (!notice) return;
    notice.dataset.open = "false";
    if (noticeTimer) {
      clearTimeout(noticeTimer);
      noticeTimer = null;
    }
    setTimeout(() => {
      notice.hidden = true;
    }, 250);
  }

  function showNotice(message) {
    if (!notice || !noticeMessage || !message) return;
    if (noticeCooldown) return;
    noticeMessage.textContent = message;
    notice.hidden = false;
    requestAnimationFrame(() => {
      notice.dataset.open = "true";
    });
    if (noticeTimer) clearTimeout(noticeTimer);
    noticeTimer = setTimeout(closeNotice, 1500);
    if (noticeCooldownTimer) clearTimeout(noticeCooldownTimer);
    noticeCooldown = true;
    noticeCooldownTimer = setTimeout(() => {
      noticeCooldown = false;
    }, 1500);

    if (noticeResetTimer) clearTimeout(noticeResetTimer);
    noticeResetTimer = setTimeout(() => {
      clearInlineErrors();
      updateSubmitIcon();
      noticeResetTimer = null;
    }, 1500);
  }

  function formatNoticeMessage(errors) {
    const messages = Object.values(errors).filter(Boolean);
    return messages.length ? messages.join(" • ") : "";
  }

  async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  }

  async function loadServices() {
    if (!serviceSelect) return;
    serviceSelect.disabled = true;
    try {
      const data = await fetchJson(`${API_BASE}/services`);
      if (!Array.isArray(data)) throw new Error("Invalid services payload");

      Object.keys(serviceCatalog).forEach((key) => delete serviceCatalog[key]);
      const fragment = document.createDocumentFragment();
      data.forEach((item) => {
        if (!item || !item.id || !item.label) return;
        serviceCatalog[item.id] = { label: item.label };
        const opt = document.createElement("option");
        opt.value = item.id;
        opt.textContent = item.label;
        fragment.appendChild(opt);
      });

      while (serviceSelect.options.length > 1) {
        serviceSelect.remove(1);
      }
      serviceSelect.appendChild(fragment);
      render(store.getState());
    } catch (err) {
      // keep fallback placeholder if API is unavailable
    } finally {
      serviceSelect.disabled = false;
    }
  }

  async function loadAppointments() {
    try {
      const data = await fetchJson(`${API_BASE}/appointments`);
      if (!Array.isArray(data)) throw new Error("Invalid appointments payload");
      store.update((prev) => ({
        ...prev,
        data: { ...prev.data, appointments: data },
      }));
    } catch (err) {
      // keep in-memory data if API is unavailable
    }
  }

  async function createAppointment(appointment) {
    return fetchJson(`${API_BASE}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appointment),
    });
  }

  async function deleteAppointment(id) {
    const res = await fetch(`${API_BASE}/appointments/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete");
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
      return closeAllModals(withAppt);
    });
  }

  function dispatchRemove(id) {
    store.update((prev) =>
      reduceAppointments(prev, {
        type: "REMOVE_APPOINTMENT",
        payload: { id },
      }),
    );
  }

  function render(state) {
    renderDaily(state);

    if (state.ui.modals.newAppointmentOpen) {
      if (dateInputEl && !dateInputEl.value) {
        dateInputEl.value = state.ui.calendar.selectedDateISO;
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
  loadServices();
  loadAppointments();

  if (dateInputEl) {
    dateInputEl.addEventListener("change", () => {
      if (!dateInputEl.value) return;
      store.update((prev) => updateCalendar(prev, dateInputEl.value));
    });
  }


  form.addEventListener("change", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.name !== "petType") return;
    updateSubmitIcon();
  });

  form.addEventListener("submit", async (e) => {
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
      showNotice(formatNoticeMessage(errors));
      return;
    }

    renderFormErrors({});
    FIELDS.forEach((f) => setInvalid(f, false));

    const hasConflict = store
      .getState()
      .data.appointments.some(
        (appointment) =>
          appointment.dateISO === draft.dateISO &&
          appointment.time === draft.time,
      );

    if (hasConflict) {
      const conflictError = { time: "Horário já ocupado" };
      renderFormErrors(conflictError);
      setInvalid("time", true);
      showNotice(formatNoticeMessage(conflictError));
      return;
    }

    const appointment = { id: makeId(), ...draft };

    try {
      const saved = await createAppointment(appointment);
      dispatchAdd(saved);
    } catch (err) {
      showNotice("Unable to save appointment");
      return;
    }
    form.reset();
    updateSubmitIcon();
  });

  document.addEventListener("click", async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest('[data-action="delete-appointment"]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = btn.getAttribute("data-appointment-id");
    if (!id) return;
    dispatchRemove(id);
    try {
      await deleteAppointment(id);
    } catch (err) {
      showNotice("Unable to delete appointment");
      loadAppointments();
    }
  });
}
