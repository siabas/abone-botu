const { EmbedBuilder } = require('discord.js');
const config = require("../../config.js")
const emoji = config.Emojis
const settings = config.Settings
const { JsonProvider } = require("ervel.db")
const db = new JsonProvider({ path: "./database/db.json" })

module.exports = {
    name: 'abone',
    aliases: ["a"],
    description: 'Kullanıcıya abone rolü verir.',
    async execute(message, args, client) {

        if (!message.member.permissions.has("Administrator") && !message.member.roles.cache.has(settings.aboneyetkilisi)) {
            return message.reply({
                embeds: [ new EmbedBuilder()
                    .setDescription(`**${emoji.cross} | Bu komutu kullanabilmek için \`${message.guild.roles.cache.get(settings.aboneyetkilisi).name}\` rolüne sahip olmalısın.**`)
                    .setColor("Red")
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
                 ]
            });
        }

        const user = message.mentions.users.first();

        if (!user) {
            return message.reply({
                embeds: [ new EmbedBuilder()
                    .setDescription(`**${emoji.cross} | Bir kullanıcıyı etiketle.**`)
                    .setColor("Red")
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
                 ]
            });
        }

        if (user.bot) {
            return message.reply({
                embeds: [ new EmbedBuilder()
                    .setDescription(`**${emoji.cross} | Bir bota bu işlemi uygulayamazsın.**`)
                    .setColor("Red")
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
                 ]
            });
        }

        if (message.guild.members.cache.get(user.id).roles.cache.has(settings.abonerolü)) {
            return message.reply({
                embeds: [ new EmbedBuilder()
                    .setDescription(`**${emoji.cross} | Bu kişi zaten abone rolüne sahip.**`)
                    .setColor("Red")
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
                 ]
            });
        }

        let aboneler = db.get("aboneler") || []
        
        if (aboneler.some(abone => abone.id === user.id)) {
            return message.reply({
                embeds: [ new EmbedBuilder()
                    .setDescription(`**${emoji.cross} | Bu kişi önceden abone rolü almış!**`)
                    .setColor("Red")
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
                ]
            });
        }

        if (message.guild.members.me.roles.highest.position <= message.guild.roles.cache.get(settings.abonerolü).position) {
            return message.reply({
                embeds: [ new EmbedBuilder()
                    .setDescription(`**${emoji.cross} | Rolün poziyonu benim rolümün pozisyonundan daha yüksek.**`)
                    .setColor("Red")
                    .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                    .setTimestamp()
                ]
            });
        }

        aboneler.push({ id: user.id, time: Date.now(), yetkili: message.member.id})
        db.set("aboneler", aboneler)

        message.guild.members.cache.get(user.id).roles.add(settings.abonerolü)

        const log = message.guild.channels.cache.get(settings.abonelog);
        if (log) {
            const logEmbed = new EmbedBuilder()
            .setTitle("📥 Abone Rolü Verildi")
            .setDescription(`
**Yetkili:** ${message.member} (\`${message.member.id}\`)
**Kullanıcı:** ${user} (\`${user.id}\`)
**Zaman:** <t:${Math.floor(Date.now() / 1000)}:F>
`)
            .setColor("Green")
            .setTimestamp();


            log.send({ embeds: [logEmbed] });
}

        message.reply({
            embeds: [ new EmbedBuilder()
                .setDescription(`${user} kişisine \`${message.guild.roles.cache.get(settings.abonerolü).name}\` rolü verildi.`)
                .setColor("Yellow")
                .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
                .setTimestamp()
            ]
        });
    }
};