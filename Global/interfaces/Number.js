export function number_minute() {
const current = this;
  return `${Math.floor(current / 60)}:${String(current % 60).padStart(2, '0')}`;
};