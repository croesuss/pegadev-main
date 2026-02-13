import { CommandInteraction, ContextMenuCommandInteraction, Client, SlashCommandBuilder } from "discord.js";

/**
 * 
 * @param {Client} client 
 * @param {CommandInteraction} interaction 
 */
async function execute(client, interaction) {
  console.log(interaction.options);
};

export default {
  config: {
    permissions: {
      category: "root",
      roles: [],
      users: [],
      bitfields: []
    },
    data: new SlashCommandBuilder()
    .setName("test")
    .setDescription(`Neden ağlattın`)
  },
  execute
};