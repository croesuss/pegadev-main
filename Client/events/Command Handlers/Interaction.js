import { Client, CommandInteraction, ContainerBuilder, ContextMenuCommandInteraction, Events } from "discord.js";
import config from "@global/config";

/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction | ContextMenuCommandInteraction} interaction 
 */
async function execute(client, interaction) {
  if(!interaction.guildId || interaction.user.bot) return;
  if(!interaction.isCommand() && !interaction.isContextMenuCommand()) return;
const commandName = interaction.commandName;
const cmd = client.slashCommands.get(commandName) || client.contextMenus.get(commandName);
  if(!cmd) return;

try {
  await cmd.execute(client, interaction);
} catch(error) {
  console.log({ type: "error", prefix: "InteractionCommandHandler", message: `Interaction Command Execution Failed. / ${cmd.config.name}`, error });
};
};

export default {
  config: {
    name: Events.InteractionCreate
  },
  execute
};