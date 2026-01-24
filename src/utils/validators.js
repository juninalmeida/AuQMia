const isEmpty = (v) => !v || String(v).trim() === "";
const pad2 = (n) => String(n).padStart(2, "0");
const toISODate = (date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

export function validateAppointment(draft) {
  const errors = {};

  if (!["dog", "cat"].includes(draft.petType))
    errors.petType = "Selecione o tipo";
  if (isEmpty(draft.petName)) errors.petName = "Informe o nome do pet";
  if (isEmpty(draft.ownerName)) errors.ownerName = "Informe o nome do tutor";
  if (isEmpty(draft.service)) errors.service = "Selecione o serviço";
  if (isEmpty(draft.time)) errors.time = "Informe o horário";
  if (isEmpty(draft.dateISO)) errors.dateISO = "Informe a data";

  if (!errors.dateISO) {
    const todayISO = toISODate(new Date());
    if (draft.dateISO < todayISO) {
      errors.dateISO = "Data já passou";
    }
  }

  if (!errors.time && !errors.dateISO) {
    const todayISO = toISODate(new Date());
    if (draft.dateISO === todayISO) {
      const [hh, mm] = String(draft.time).split(":").map(Number);
      if (Number.isFinite(hh) && Number.isFinite(mm)) {
        const now = new Date();
        const scheduled = new Date();
        scheduled.setHours(hh, mm, 0, 0);
        if (scheduled.getTime() < now.getTime()) {
          errors.time = "Horário já passou";
        }
      }
    }
  }

  return { ok: Object.keys(errors).length === 0, errors };
}
