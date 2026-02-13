import { Client, Message , EmbedBuilder} from "discord.js";
const util = require("util");

/**
 * 
 * @param {Client} client
 * @param {Message} message 
 * @param {Array} args 
 */
async function execute(client, message, args,component) {
    if (!args[0]) return message.react("1467701590583542065");
    try {
      const response = clean(eval(args.join(" ")));
      const embed = new EmbedBuilder().setDescription(`> Query:\n\`\`\`js\n${args.join(" ")}\`\`\`\n> Response:\n\`\`\`js\n${response}\`\`\``).setColor(0x2ecc71);
      message.channel.send({ embeds: [embed] });
    } catch (evalError) {
      const embed = new EmbedBuilder().setDescription(`Hocaaa Eval Hatalı Hocaa\n> Query:\n\`\`\`js\n${args.join(" ")}\`\`\`\n> Error:\n\`\`\`js\n${evalError}\`\`\``).setColor(0xe74c3c);
      message.channel.send({ embeds: [embed] });
    }
};

export default {
  config: {
    name: "eval",
    aliases: []
  },
  execute
};

function clean(text) {
  if (typeof text !== "string") text = util.inspect(text, { depth: 0 });
  text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  return text;
}
