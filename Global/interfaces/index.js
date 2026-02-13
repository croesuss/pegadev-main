import { array_last, array_random, array_whitespace } from "./Array.js";
import { string_last, string_random } from "./String.js";
import { number_minute } from "./Number.js";
import "./discord/Message.js";

import chalk from "chalk";

const consolelog = console.log;
function baseConsoleLog(...params) {
const date = new Date();
const dateformat = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`;
  consolelog(chalk.black(dateformat), ...params);
};

console.log = function(obj, ...args) {
  if(typeof obj !== "object" || obj["type"]) return baseConsoleLog(obj, ...args);
  if(!obj?.message) return baseConsoleLog(obj, ...args);
let [type, prefix, message, error] = [];
  type = obj?.type || "info";
  prefix = obj?.prefix || "Global";
  message = obj?.message;
  
const date = new Date();
const dateformat = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`;

let suffixColor = chalk.hex("#000").bold;

let suffix = `${suffixColor.bgHex("#a78bfa")(`ㅤ${prefix}ㅤ`)} ${chalk.hex("#c4b5fd")(message)}`;
  if(type.toLowerCase() === "success") suffix = `${suffixColor.bgHex("#4ade80")(`ㅤ${prefix}ㅤ`)} ${chalk.hex("#bbf7d0")(message)}`;
  if(type.toLowerCase() === "warn") suffix = `${suffixColor.bgHex("#fdba74")(`ㅤ${prefix}ㅤ`)} ${chalk.hex("#fed7aa")(message)}`;
if(type.toLowerCase() === "error") {
  suffix = `${suffixColor.bgHex("#f87171")(`ㅤ${prefix}ㅤ`)} ${chalk.hex("#f87171")(message)}`;
if(error?.stack) {
const errorType = suffixColor.bgHex("#ef4444")(` ${error.name || "Error"} `);
const errorMessage = chalk.hex("#f87171")(error.message || "An error occurred");
const errorStack = error.stack.replace(`${error.name}: ${error.message}`, "").trim().split("\n").map(line => (line.includes("at file://") ? "at "+chalk.hex("#fecaca")(line.replace("at ", "")) : line).trim()).join("\n");
  return consolelog(`${chalk.black(dateformat)} ${suffix} ${chalk.black("—")} ${errorType} ${errorMessage}\n${chalk.hex("#f87171")(errorStack)}`);
};
};

  return consolelog(`${chalk.black(dateformat)} ${suffix}`);
};

Object.defineProperties(Array.prototype, {
  last: { value: array_last, configurable: true },
  random: { value: array_random, configurable: true },
  whitespace: { value: array_whitespace, configurable: true }
});

Object.defineProperties(String.prototype, {
  last: { value: string_last, configurable: true },
  random: { value: string_random, configurable: true }
});

Object.defineProperties(Number.prototype, {
  minute: { value: number_minute, configurable: true }
});