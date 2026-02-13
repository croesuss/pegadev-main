const { Client, Events, BaseInteraction, ButtonInteraction, ModalSubmitInteraction, ModalBuilder, TextDisplayBuilder, LabelBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits, OverwriteType, MessageFlags, ContainerBuilder, SectionBuilder, ThumbnailBuilder, SeparatorBuilder, SeparatorSpacingSize, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, FileBuilder, MediaGalleryItemBuilder, ActionRowBuilder, StringSelectMenuInteraction } = require("discord.js");

import { Routes } from "discord-api-types/v10";
import { REST } from "@discordjs/rest";
import config from "@global/config";

/**
 * 
 * @param {Client} client 
 */
async function execute(client, interaction) {
  if (interaction.isStringSelectMenu() && interaction.customId === "ticket-menu") {
  const value = interaction.values[0];
  const ticketSebebi = value === "bot_support" ? "Bot Destek" : value === "design_support" ? "Tasarım" : value === "web_support" ? "Web" : "Diğer";
  const category = interaction.guild.channels.cache.get("1464380853286211817");
  if (!category) return;
   const ticketChannel = await interaction.guild.channels.create({
   name: `${ticketSebebi}│${interaction.user.username.toLowerCase()}`,
   topic: value === "bot_support" ? "Bot Destek Talebi" : value === "design_support" ? "Tasarım Talebi" : value === "web_support" ? "Web Talebi" : "Diğer Talepler & Genel Sorular",
   type: ChannelType.GuildText,
   parent: category,
   permissionOverwrites: [
     { id: interaction.guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
     { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory] },
    ]
  });
  const ticketChannelSendMessage = new ContainerBuilder()
  .addSectionComponents([
  new SectionBuilder()
  .addTextDisplayComponents([
    new TextDisplayBuilder().setContent(`## ${ticketSebebi} Konulu Destek Talebi!`),
    new TextDisplayBuilder().setContent([
      `> ${interaction.member} tarafından <t:${Math.round(Date.now() / 1000)}:R> tarihinde destek talebi oluşturuldu.`,
      `> Oluşturulan destek talebinin bilgileri aşağıda yer almaktadır.\n`,
      `<:small_dot_white:1464763121523495126> Kategori: **${ticketSebebi}**`,
      `<:small_dot_white:1464763121523495126> Durum: <:star_red:1464764946540789781> **Beklemede**`,
    ].join("\n"))
    
  ])
  .setThumbnailAccessory(b => b.setURL(interaction.member.displayAvatarURL({ size: 1024, extension: "png", forceStatic: false })))
])
.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Large))
.addActionRowComponents(row => row.addComponents(
  new ButtonBuilder()
  .setCustomId("yet-accept")
  .setLabel("Yetkili | Sahiplen")
  .setEmoji("1465008134320947404")
  .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
  .setCustomId("yet-close")
  .setLabel("Yetkili | Kapat")
  .setEmoji("1465063134514643139")
  .setStyle(ButtonStyle.Secondary),
))
.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Large))
.addTextDisplayComponents(new TextDisplayBuilder().setContent("-# Pega Loves You <:pega_heart:1469402607712866486>"));
ticketChannel.send({ components: [ticketChannelSendMessage], flags: MessageFlags.IsComponentsV2})
return interaction.reply({ content: `Destek talebiniz oluşturuldu! ${ticketChannel}`, ephemeral: true });
} else if (interaction.isButton()) {
  if (interaction.customId === "yet-accept") {
    const msg = interaction.message;
const components = interaction.message.components;
  components[0].components.find(c => c.data.type === 1).components.forEach(x => {
    x.data.disabled = true;
  })
  await msg.edit({ components });
  await interaction.reply({
    components: [
      new ContainerBuilder().addTextDisplayComponents(b => b.setContent(`Bu Talep <t:${Math.round(Date.now() / 1000)}:R> Tarihinde ${interaction.user} Adlı Yetkili Tarafından  Kapatıldı.`))
    ],
    flags: MessageFlags.IsComponentsV2
  });
    if (!interaction.member.roles.cache.has("1463989311426007040")) return interaction.reply({ content: "Bu işlemi gerçekleştirmek için yetkiniz bulunmamaktadır!", ephemeral: true });
    const channel = interaction.channel;
    if (channel.parentId !== "1464380853286211817") return interaction.reply({ content: "Bu buton sadece destek talebi kanallarında kullanılabilir!", ephemeral: true });
    await channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true, SendMessages: true, AttachFiles: true, ReadMessageHistory: true });
    return interaction.reply({ content: `Destek talebini başarıyla sahiplendiniz! ${channel}`, ephemeral: true });
  } else if (interaction.customId === "yet-close") {
        const msg = interaction.message;
const components = interaction.message.components;
  components[0].components.find(c => c.data.type === 1).components.forEach(x => {
    x.data.disabled = true;
  })
  await msg.edit({ components });
  await interaction.reply({
    components: [
      new ContainerBuilder().addTextDisplayComponents(b => b.setContent(`Bu Talep <t:${Math.round(Date.now() / 1000)}:R> Tarihinde ${interaction.user} Adlı Yetkili Tarafından  Kapatıldı.`))
    ],
    flags: MessageFlags.IsComponentsV2
  });
    if (!interaction.member.roles.cache.has("1463989311426007040")) return interaction.reply({ content: "Bu işlemi gerçekleştirmek için yetkiniz bulunmamaktadır!", ephemeral: true });
    const channel = interaction.channel;
    if (channel.parentId !== "1464380853286211817") return interaction.reply({ content: "Bu buton sadece destek talebi kanallarında kullanılabilir!", ephemeral: true });
    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { ViewChannel: false, SendMessages: false, AttachFiles: false, ReadMessageHistory: false });
    return interaction.reply({ content: `Destek talebini başarıyla kapattınız!`, ephemeral: true });
  }
}


};

export default {
  config: {
    name: Events.InteractionCreate
  },
  execute
};