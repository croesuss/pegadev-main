import { Client, Message , ContainerBuilder , MessageFlags} from "discord.js";

/**
 * 
 * @param {Client} client
 * @param {Message} message 
 * @param {Array} args 
 */
async function execute(client, message, args) {
       if (!["948975442159886398", "746066222310883339"].includes(message.author.id)) return;
        const wlRole = message.guild.roles.cache.get("1463983350065659925")

        message.reply({ content: "Üyeler Yükleniyor, bekleyiniz..." });
        const members = await message.guild.members.fetch();
        let ok = 0, fail = 0, passed = 0;


        for (const [id, member] of members) {
            if (member.user.bot || member.roles.cache.has(wlRole.id)) {
                passed++;
            } else {

                try {
                    await member.roles.add(wlRole.id);
                    ok++;
                } catch (e) {
                    fail++;
                    
                console.log(`Fail ${member.user.username} ${fail}`, e);
                }
            }
            if ((ok + fail + passed) === members.size) message.channel.send({ components: [new ContainerBuilder().addTextDisplayComponents(b => b.setContent(`Verilen Rol: <@&${wlRole.id}>\nRol Verilen Üye Sayısı: **${ok}**\nRol Verilemeyen Üye Sayısı: **${fail}**\nZaten Role Sahip Üye Sayısı: **${passed}**`))], flags: MessageFlags.IsComponentsV2 });
        };
};

export default {
  config: {
    name: "test",
    aliases: []
  },
  execute
};