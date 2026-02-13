export function array_last() {
  return this[this.length - 1];
};

export function array_random() {
  return this[Math.floor(Math.random() * this.length)];
};

export function array_whitespace(values, index) {
const keys = values.map(s => s.padEnd(Math.max(...values.map(n => n.length))));
  return index != null ? keys : values;
};