import { Client, Events } from "discord.js";
import { Routes } from "discord-api-types/v10";
import { REST } from "@discordjs/rest";
import config from "@global/config";

/**
 * 
 * @param {Client} client 
 */
async function execute(client) {
  console.log({ prefix: "BaseReady", message: `Bot is online as ${client.user.tag}` });
};

export default {
  config: {
    name: Events.ClientReady
  },
  execute
};