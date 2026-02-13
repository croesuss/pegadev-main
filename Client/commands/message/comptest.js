import { Client, Message , ContainerBuilder , TextDisplayBuilder, MessageFlags} from "discord.js";

/**
 * 
 * @param {Client} client
 * @param {Message} message 
 * @param {Array} args 
 */
async function execute(client, message, args, send) {
      if (!["948975442159886398", "746066222310883339"].includes(message.author.id)) return;
      const container = new ContainerBuilder()
      .addTextDisplayComponents([
        new TextDisplayBuilder()
        .setContent("Test Mesaj")
      ])
};

export default {
  config: {
    name: "comptest",
    aliases: []
  },
  execute
};