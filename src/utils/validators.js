const isEmpty = (v) => !v || String(v).trim() === "";

export function validateAppointment(draft) {
  const errors = {};

  if (!["dog", "cat"].includes(draft.petType))
    errors.petType = "Selecione o tipo";
  if (isEmpty(draft.petName)) errors.petName = "Informe o nome do pet";
  if (isEmpty(draft.ownerName)) errors.ownerName = "Informe o nome do tutor";
  if (isEmpty(draft.service)) errors.service = "Selecione o serviço";
  if (isEmpty(draft.time)) errors.time = "Informe o horário";
  if (isEmpty(draft.dateISO)) errors.dateISO = "Informe a data";

  return { ok: Object.keys(errors).length === 0, errors };
}
