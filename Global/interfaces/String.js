function makeid(length) {
const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const t = c.length;
let r = "";
  for(let i = 0; i < length; i++) { r += c.charAt(Math.floor(Math.random() * t)); };
  return r;
};

export function string_random(length) {
  return makeid(length);
};

export function string_last() {
  return this[this.length - 1];
};