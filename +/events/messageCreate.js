const config = require("../../config.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    if (!message.content.startsWith(config.Bot.prefix)) return;

    const args = message.content.slice(config.Bot.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.aliases.get(commandName);
    if (!command) return;

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error('[ ! ] Komut hatası:', error);
    }
  },
};