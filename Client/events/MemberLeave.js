import { GuildMember, User, Invite, ContainerBuilder , TextDisplayBuilder} from "discord.js";
import config from "@global/config";

/**
 * 
 * @param {GuildMember} member
 * @param {User} inviter
 * @param {Invite} invite
 * 
 */
async function execute(client,member,inviter,invite) {
 const inviteLog = member.guild.channels.cache.get(config.discord.InviteLog);

   if(inviteLog) {
     if(!inviter) {
      inviteLog.send(`<:pega_leave:1467700758219587830> ${member} Sunucudan Ayrıldı Fakat Kimin Davet Ettiğini Bulamadım.`);
    } else if(member.id == inviter.id) {
      inviteLog.send(`<:pega_leave:1467700758219587830> ${member} Sunucudan Ayrıldı Fakat Kendi Davetiyle Katılmıştı.`);
    } else if(member.guild.vanityURLCode == inviter) {
      inviteLog.send(`<:pega_leave:1467700758219587830> ${member} Sunucudan Ayrıldı Ve Sunucunun Özel Davet Linki İle Girmişti.`);
    } else {
  client.InviteManager.inviteAdd(member.guild.id, inviter,1);
  inviteLog.send(`<:pega_leave:1467700758219587830> ${member} Sunucudan Ayrıldı! Davet Eden: ${inviter.username}`);
};
   } else {
     console.log("Invite log channel not found");
   }

};

export default {
  config: {
    name: "memberLeave"
  },
  execute
};