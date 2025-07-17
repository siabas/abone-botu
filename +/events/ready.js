const { ActivityType } = require("discord.js")
const bot = require("../../config.js").Bot

module.exports = {
  name: 'ready',
  once: true, 
  execute(client) {
    console.log(`[ + ] ${client.user.tag} olarak giriş yapıldı.`);
    client.user.setPresence({
      activities: [{ name: bot.status, type: 0 }],
      status: ActivityType.idle,
    });
  },
};