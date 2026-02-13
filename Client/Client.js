import { Client, GatewayIntentBits, Partials, Collection, ActivityType, Events } from "discord.js";
import { Routes } from "discord-api-types/v10";
import { REST } from "@discordjs/rest";
import config from "@global/config";
import { join } from "path";

export default class extends Client {
constructor() {
  super({
    intents: Object.keys(GatewayIntentBits),
    partials: Object.keys(Partials),
    presence: { activities: [
      {
        name: "Pega is under development!",
        type: ActivityType.Streaming,
        url:"https://twitch.tv/pegabilisim"
      }
    ], status: "dnd" }
  });
};

async read(paths) {
const client = this;
  this.commands = new Collection();
  this.aliases = new Collection();
  this.slashCommands = new Collection();
  this.contextMenus = new Collection();
  this.cooldowns = new Collection();

paths.commands.contextMenu.forEach(async function(file) {
try {
const cmd = (await import(`@bot/${file.replace(/\\/g, "/")}`))?.default;
  if(!cmd || !cmd.config || !cmd.execute) return;

  console.log({ prefix: "CommandLoader", message: `Context Menu Command Loaded. / ${cmd.config.data.name}` });
  client.contextMenus.set(cmd.config.data.name, cmd);
} catch(error) {
  console.log({ type: "error", prefix: "CommandLoader", message: `Context Menu Command Not Loaded. / ${file}`, error });
};
});

paths.commands.message.forEach(async function(file) {
try {
const cmd = (await import(`@bot/${file.replace(/\\/g, "/")}`))?.default;
  if(!cmd || !cmd.config || !cmd.execute) return;

  console.log({ prefix: "CommandLoader", message: `Message Command Loaded. / ${cmd.config.name}` });
  client.commands.set(cmd.config.name, cmd);
  cmd.config.aliases?.forEach(alias => client.aliases.set(alias, cmd.config.name));
} catch(error) {
  console.log({ type: "error", prefix: "CommandLoader", message: `Message Command Not Loaded. / ${file}`, error });
};
});

paths.commands.slash.forEach(async function(file) {
try {
const cmd = (await import(`@bot/${file.replace(/\\/g, "/")}`))?.default;
  if(!cmd || !cmd.config || !cmd.execute) return;

  console.log({ prefix: "CommandLoader", message: `Slash Command Loaded. / ${cmd.config.data.name}` });
  client.slashCommands.set(cmd.config.data.name, cmd);
} catch(error) {
  console.log({ type: "error", prefix: "CommandLoader", message: `Slash Command Not Loaded. / ${file}`, error });
};
});

paths.events.forEach(async function(file) {
try {
const event = (await import(`@bot/${file.replace(/\\/g, "/")}`))?.default;
  if(!event || !event.config || !event.execute) return;

  console.log({ prefix: "EventLoader", message: `Event Loaded. / ${event.config.name}` });
  client.on(event.config.name, (...args) => event.execute(client, ...args));
} catch(error) {
  console.log({ type: "error", prefix: "EventLoader", message: `Event Not Loaded. / ${file}`, error });
};
});

client.once(Events.ClientReady, async function() {
if(client.slashCommands.size > 0 || client.contextMenus.size > 0) {
const body = [];
client.slashCommands.forEach(cmd => body.push(cmd));
client.contextMenus.forEach(cmd => body.push(cmd));

const rest = new REST({ version: "10" }).setToken(client.token);
  await rest.put(Routes.applicationGuildCommands(client.user.id, config.discord.guildId), { body: body.map(x => x.config.data.toJSON()) });
};
});
};
};