export function makeId() {
  return String(Date.now()) + "-" + Math.random().toString(16).slice(2);
}
