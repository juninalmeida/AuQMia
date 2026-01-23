export function isEmpty(v) {
  return !v || String(v).trim() === "";
}

export function validateAppointment(draft) {
  const errors = {};

  if (isEmpty(draft.petName)) errors.petName = "Informe o nome do pet";
  if (isEmpty(draft.tutorName)) errors.tutorName = "Informe o nome do tutor";
  if (isEmpty(draft.service)) errors.service = "Selecione um serviço";
  if (isEmpty(draft.time)) errors.time = "Informe o horário";
  if (isEmpty(draft.dateISO)) errors.dateISO = "Informe a data";
  if (draft.petType !== "dog" && draft.petType !== "cat")
    errors.petType = "Selecione o tipo";

  return { ok: Object.keys(errors).length === 0, errors };
}
