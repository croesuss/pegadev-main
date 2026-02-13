import { MessageFlags, GuildMember, User, Invite, ContainerBuilder, ButtonBuilder, ButtonStyle, SeparatorSpacingSize } from "discord.js";
import config from "@global/config";
import sharp from "sharp";
import { Canvas, Image, loadImage, FontLibrary } from "skia-canvas";
import fs from "fs";
import { join } from "path";

FontLibrary.use("Quicksand", [join(process.cwd(), "Global", "assets", "Quicksand-Light.ttf"), join(process.cwd(), "Global", "assets", "Quicksand-Regular.ttf"), join(process.cwd(), "Global", "assets", "Quicksand-Medium.ttf")]);

/**
 *
 * @param {GuildMember} member
 * @param {User} inviter
 * @param {Invite} invite
 *
 */
async function execute(client, member, inviter, invite) {
    const canvas = new Canvas(1280, 640);
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const bg = await loadImage(join(process.cwd(), "Global/assets/canvas-bg.png"));
    ctx.drawImage(bg, 0, 0, width, height);

    const avatar = await loadImage(member.user.avatarURL({ forceStatic: false, size: 4096 }));
    const avatarSize = 320;
    const avatarX = 1280 / 2;
    const avatarY = 64 + avatarSize / 2;
    const radius = avatarSize / 2;
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.save();
    ctx.clip();
    ctx.drawImage(avatar, avatarX - radius, avatarY - radius, avatarSize, avatarSize);
    ctx.restore();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#3f3f46";
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "500 48px Quicksand";
    ctx.fillStyle = "#d4d4d4";
    const textSizeWelcome = ctx.measureText("Sunucumuza Hoşgeldin");
    ctx.fillText("Sunucumuza Hoşgeldin", width / 2 - textSizeWelcome.width / 2, height - 128);

    ctx.font = "500 56px Quicksand";
    ctx.fillStyle = "#ffffff";
    const textSize = ctx.measureText(member.user.username);
    ctx.fillText(member.user.username, width / 2 - textSize.width / 2, height - 128 - 24 - textSizeWelcome.actualBoundingBoxAscent);

    const pngData = await canvas.png;

  const welcomeChannel = member.guild.channels.cache.get(config.discord.welcomeChannel);
  const inviteLog = member.guild.channels.cache.get(config.discord.InviteLog);
  member.roles.add(config.discord.defaultRole);
  if (welcomeChannel) {

    welcomeChannel.send({
      content: `**<a:pega_wave:1467701590583542065> Aramıza Hoşgeldin ${member} ! Seninle Beraber *${member.guild.memberCount}* Kişiyiz.**

**<:pega_developer:1467695954076368946> Bot/Website Projelerimize Göz Atmak İstersen <#1467696626134028403> Kanalını Ziyaret Edebilirsin.**

**<:pega_artist:1467696101443375197> Tasarımlarımıza Göz Atmak İstersen  <#1467292951552987267> Kanalımızı Ve Daha Fazlasını Ziyaret Edebilirsin.**

**<:pega_ticket:1467696074612539534> Aklına Takılan Herhangi Bir Konu Var İse Bizlerle <#1464382211959558388> Kanalından İletişime Geçebilirsin.** `,
      files: [{ attachment: pngData, name: "attachment://welcome.png" }]
    });
  } else {
    console.log("Welcome channel not found");
  }

  try {
    const container = new ContainerBuilder()
    .addSectionComponents(section => section.setThumbnailAccessory(b => b.setURL(member.guild.iconURL({ forceStatic: false, size: 4096 }))).addTextDisplayComponents(b => b.setContent([
      `<a:pega_wave:1467701590583542065> Merhabalar **${member.user.username}**! Pega Topluluğumuza Hoşgeldin.\n`,
      `<:pega_timer:1468004269054497005> Sunucuya Katılma Tarihin: <t:${Math.floor(Date.now() / 1000)}:R>`
    ].join("\n"))))
    .addTextDisplayComponents(b => b.setContent([
      `<:pega_linked:1464999852462051388> Aşağıda Yer Alan Butonlardan Veya Sunucumuz Üzerinden Projelerimizi İnceleyebilirsin.\n`,
      `<:pega_stage:1468008819228545026> Sunucumuza katıldığın andan itibaren tüm hizmetlerimize erişebilir,projelerimizi inceleyebilir ve destek ekibimizle iletişime geçebilirsin.\n`,
      `<a:pega_arrow:1464999471401140244> [Sunucunuza Özel Tasarım](https://discord.gg/pegadev)`,
      `<a:pega_arrow:1464999471401140244> [Discord botları](https://pegabilisim.com.tr)`,
      `<a:pega_arrow:1464999471401140244> [Web & özel yazılım projeleri](https://pegabilisim.com.tr)\n`,
      `<a:pega_arrow:1464999471401140244> Yönetim panelleri ve otomasyon sistemleri ve daha fazlası için aşağıdaki butonlar üzerinden tüm detaylara ulaşabilirsin.\n`,
      `**Başarıyla dolu bir yolculuk dileriz.** <:pega_new:1468006149847646372>`
    ].join("\n")))
    .addSeparatorComponents(seperator => seperator.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
    .addActionRowComponents(row => row.addComponents([
      new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("Websitemiz")
      .setURL("https://pegabilisim.com.tr"),
      new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("Discord Sunucumuz")
      .setURL("https://discord.gg/pegadev")
    ]))
    .addMediaGalleryComponents(b => b.addItems(a => a.setURL("attachment://welcome.png")))
    member.user.send({ components: [container], files: [{ attachment: pngData, name: "welcome.png" }], flags: MessageFlags.IsComponentsV2 })
  } catch(error) {
    console.log("DM Kapalı", error);
  }
  

  

  if (inviteLog) {
    if (!inviter) {
      inviteLog.send(`<:pega_join:1467701819684683786> ${member} Sunucuya Katıldı Fakat Kimin Davet Ettiği Bulunamadı.`);
    } else if (member.id == inviter.id) {
      inviteLog.send(`<:pega_join:1467701819684683786> ${member} Sunucuya Katıldı Fakat Kendi Davetiyle Girdi.`);
    } else if (member.guild.vanityURLCode == inviter) {
      inviteLog.send(`<:pega_join:1467701819684683786> ${member} Sunucuya Katıldı Ve Sunucunun Özel Davet Linki İle Girdi.`);
    } else {
      client.InviteManager.inviteAdd(member.guild.id, inviter, 1);
      inviteLog.send(`<:pega_join:1467701819684683786> ${member.user} Sunucuya Katıldı! Davet Eden: ${inviter}`);
    }
  } else {
    console.log("Invite log channel not found");
  }
}

export default {
  config: {
    name: "memberJoin"
  },
  execute
};
