const { EmbedBuilder } = require('discord.js');
const config = require("../../config.js")
const emoji = config.Emojis;
const { JsonProvider } = require("ervel.db")
const db = new JsonProvider({ path: "./database/db.json" })

module.exports = {
    name: "top",
    aliases: ["top-abone", "top10", "top-a", "topabone"],
    description: 'En çok abone verenleri gösterir.',
    async execute(message, args, client) {
        const aboneler = await db.get("aboneler") || [];

        if (aboneler.length === 0) {
            return message.reply({
                embeds: [ new EmbedBuilder()
                    .setDescription(`**${emoji.cross} | Henüz kimseye abone rolü verilmemiş.**`)
                    .setColor("Red")
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
                ]
            });
        }

        const puan = {};
        for (const kayit of aboneler) {
            if (!puan[kayit.yetkili]) {
                puan[kayit.yetkili] = 1;
            } else {
                puan[kayit.yetkili]++;
            }
        }

        const top = Object.entries(puan)
        .sort((a, b) => b[1] - a[1]);

        const top10 = top.slice(0, 10);

        const embed = new EmbedBuilder()
        .setTitle("💎 Top 10 - En Çok Abone Rolü Verenler")
        .setDescription(
            `✨ **Sen:** <@${message.member.id}> - \`${puan[message.member.id] || 0}\` abone (${
                top.findIndex(([id]) => id === message.member.id) + 1 || "Yok"
            }. sırada)\n\n` +
            top10.map(([id, sayi], index) => {
                return `\`${index + 1}.\` <@${id}> - \`${sayi}\` abone`;
            }).join("\n")
            )
            .setColor("Gold")
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }
};
