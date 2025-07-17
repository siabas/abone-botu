const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require("./config.js")

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.aliases = new Collection();

const commandsPath = path.join(__dirname, 'commands');

const folders = fs.readdirSync(commandsPath);

let commandCount = 0;

for (const folder of folders) {
  const folderPath = path.join(commandsPath, folder);

  if (fs.lstatSync(folderPath).isDirectory()) {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);
      if (command.name) {
        client.commands.set(command.name.toLowerCase(), command);
        commandCount++;
        if (command.aliases && Array.isArray(command.aliases)) {
          for (const alias of command.aliases) {
            client.aliases.set(alias.toLowerCase(), command);
          }
        }
      }
    }
  } else if (folder.endsWith('.js')) {
    const command = require(path.join(commandsPath, folder));
    if (command.name) {
      client.commands.set(command.name.toLowerCase(), command);
      commandCount++;
      if (command.aliases && Array.isArray(command.aliases)) {
        for (const alias of command.aliases) {
          client.aliases.set(alias.toLowerCase(), command);
        }
      }
    }
  }
}

console.log(`[ + ] Toplam ${commandCount} komut yüklendi.`);

const eventsPath = path.join(__dirname, '+/events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(config.Bot.token);