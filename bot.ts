import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';

dotenv.config();

console.log('Bot starting up...');

const bot = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES
  ]
});

bot.on('ready', async () => {
  console.log(`Bot successfully connected as ${bot.user ? bot.user.tag : ''}`);
});

bot.login(process.env.BOT_TOKEN);
