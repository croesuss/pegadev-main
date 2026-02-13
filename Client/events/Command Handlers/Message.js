import { Client, Message, Events, ComponentType, MessageFlags, ContainerBuilder, SeparatorBuilder, TextDisplayBuilder, SeparatorSpacingSize } from "discord.js";

import config from "@global/config";

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
async function execute(client, message) {
  if(!message.guild) return;
const svSahipRole = message.guild.roles.cache.get("1463981605642047623");
  if(message.channel.id === "1464381580494504048") message.react("<a:z_GlassyHeart:1467960787963215904>");
  if(!message.member.roles.cache.get(svSahipRole.id) && !message.author.bot && ["https://","discord.gg/",".gg/",".gg","www"].some(x => message.content.toLowerCase().includes(x))) return message.delete();
  if(!message.content.startsWith(".") || !message.guildId || message.author.bot) return;
const command = message.content.split(" ")[0].slice(1);
const args = message.content.split(" ").slice(1);

const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if(!cmd) return;
  if(!config.discord.owners.includes(message.author.id)) return;

  try {
    await cmd.execute(client, message, args);
  } catch(error) {
    console.log({ type: "error", prefix: "MessageCommandHandler", message: `Message Command Execution Failed. / ${cmd.config.name}`, error });
  }
};

export default {
  config: {
    name: Events.MessageCreate
  },
  execute
};