import { Client, Message , ContainerBuilder , TextDisplayBuilder, MessageFlags , SectionBuilder , SeparatorBuilder , SeparatorSpacingSize , StringSelectMenuBuilder} from "discord.js";

/**
 * 
 * @param {Client} client
 * @param {Message} message 
 * @param {Array} args 
 */
async function execute(client, message, args, send) {
      if (!["948975442159886398", "746066222310883339"].includes(message.author.id)) return;
        const sec = (isSmall) => new SeparatorBuilder().setDivider(false).setSpacing(isSmall === true ? SeparatorSpacingSize.Small : SeparatorSpacingSize.Large);
  const header = new SectionBuilder().addTextDisplayComponents([new TextDisplayBuilder().setContent("### <:pega_support:1469402346655055987> Destek Sistemi\n​"), new TextDisplayBuilder().setContent("### <:diamond_pink:1464765585068916746> Aşağıda bulunan seçeneklerden birine tıklayarak destek talebi oluşturabilirsiniz."),new TextDisplayBuilder().setContent("<:pega_warn:1469401956911943856> Konu dışı açılan destek talepleri kapatılacaktır, lütfen destek almak istediğiniz başlığa uygun kategori seçiniz.")]).setThumbnailAccessory((t) => t.setURL(message.guild.iconURL({ size: 1024, forceStatic: false }) || client.user.displayAvatarURL({ size: 1024, extension: "png" })));
  const container = new ContainerBuilder()
    .addSectionComponents(header)
    .addSeparatorComponents(sec())
    .addMediaGalleryComponents((row) => row.addItems((b) => b.setURL("https://cdn.discordapp.com/attachments/1466577181198254101/1469345341253091556/Preview-ezgif.com-video-to-gif-converter.gif?")))
    .addActionRowComponents((row) =>
      row.addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ticket-menu")
          .setMaxValues(1)
          .setPlaceholder("Destek Talebi Oluşturmak İçin Kategori Seçiniz!")
          .setRequired(true)
          .addOptions([
            {
              label: "Bot & Sunucu Hizmetleri",
              description: "Bot & Sunucu Sorunları/Satın Alım İçin Destek Talebi",
              value: "bot_support",
              emoji: "1467696031457083499"
            },
            {
              label: "Tasarım & Grafik Hizmetleri",
              description: "Tasarım & Grafik Sorunları/Satın Alım İçin Destek Talebi",
              value: "design_support",
              emoji: "1467696101443375197"
            },
            {
              label: "Web & Yazılım Hizmetleri",
              description: "Web & Yazılım Sorunları/Satın Alım İçin Destek Talebi",
              value: "web_support",
              emoji: "1469400640168923360"
            },
            {
              label: "Diğer Talepler & Genel Sorular",
              description: "Genel Talepler & Sorular İçin Destek Talebi",
              value: "general_support",
              emoji: "1465008778276634644"
            },
          ])
      )
    )
    .addSeparatorComponents(sec())
    .addTextDisplayComponents(new TextDisplayBuilder().setContent("-# Pega Loves You <:pega_heart:1469402607712866486>"));

  await message.channel.send({ components: [container], flags: MessageFlags.IsComponentsV2 });
};

export default {
  config: {
    name: "ticket",
    aliases: []
  },
  execute
};