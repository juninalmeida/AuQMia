const today = new Date();
const pad2 = (n) => String(n).padStart(2, "0");
const todayISO = `${today.getFullYear()}-${pad2(today.getMonth() + 1)}-${pad2(today.getDate())}`;

export const state = {
  ui: {
    modals: {
      newAppointmentOpen: false,
      calendarOpen: false,
    },
    selectedDateISO: "",
    calendar: {
      year: today.getFullYear(),
      month: today.getMonth(),
      selectedDateISO: todayISO,
    },
  },
  data: {
    appointments: [],
  },
};
