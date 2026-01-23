const pad2 = (n) => String(n).padStart(2, "0");

export function toISODate(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function addMonths(year, month, delta) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function getMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const start = new Date(year, month, 1 - startDay);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    cells.push({
      date: d,
      dateISO: toISODate(d),
      day: d.getDate(),
      inMonth: d.getMonth() === month,
    });
  }
  return cells;
}
