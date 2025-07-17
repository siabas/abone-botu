const { EmbedBuilder } = require("discord.js");
const { JsonProvider } = require("ervel.db");
const db = new JsonProvider({ path: "./database/db.json" });

module.exports = {
  name: "sicil",
  aliases: ["geçmiş"],
  description: "Yetkilinin geçmişini gösterir.",
  async execute(message, args, client) {
    const user = message.mentions.members.first() || message.member;

    const tümveri = await db.get("aboneler") || [];

    const kisiveri = tümveri.filter(kayıt => kayıt.yetkili === user.id);

    if (kisiveri.length === 0) {
      return message.reply({
        embeds: [new EmbedBuilder()
          .setDescription(`**${user}** kullanıcı hakkında veri bulunamadı.`)
          .setColor("Red")
          .setTimestamp()
        ]
      });
    }

    const liste = kisiveri.map((kayıt, index) => {
      const unix = Math.floor(kayıt.time / 1000); 
      return `\`${index + 1}.\` <@${kayıt.id}> - <t:${unix}:F>`;
    }).join("\n");

    const embed = new EmbedBuilder()
      .setTitle(`📜 ${user.user.username} Kullanıcısının Abone Geçmişi`)
      .setDescription(liste)
      .setColor("Blue")
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
