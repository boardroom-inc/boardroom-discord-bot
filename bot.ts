import * as Discord from 'discord.js';
import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';
import { ISubscription } from './models';
import BoardRoomApiService from './services/boardRoomApiService';
import localCommands from './commands';
import checkSubscriptions from './checkSubscriptions';
import SubscriptionService from './services/subscriptionService';

AWS.config.update({ region:'us-east-1' });
dotenv.config();

console.log('Bot starting up...');

const bot = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
  ]
});

const boardroomApi = new BoardRoomApiService();
const subscriptionService = new SubscriptionService();

let subscriptions: ISubscription[] = [];

const commands = localCommands.map(localCommand => {
  const { name, description } = localCommand;
  const options: Discord.ApplicationCommandOptionData[] = (localCommand.options || []).map(localOption => {
    return {
      name: localOption.name,
      description: localOption.description,
      type: localOption.type || 'STRING',
      required: typeof localOption.required === 'boolean' ? localOption.required : true,
    };
  });

  const command: Discord.ApplicationCommandData = { name, description, options };
  return command;
});

bot.on('ready', async () => {
  console.log(`Bot successfully connected as ${bot.user ? bot.user.tag : ''}`);
  if (bot.application) {
    await bot.application.commands.set(commands);
    console.log('Registered commands.');
  }
});

bot.on('interactionCreate', async (interaction) => {
  if (! interaction.isCommand()) {
    return;
  }

  const command = localCommands.find(command => command.name === interaction.commandName);
  if (command) {
    console.log(`Executing command: ${interaction.commandName}`);
    await command.handler({ interaction, boardroomApi, subscriptionService, subscriptions });
    console.log('Ran successfully.');
  } else {
    console.log(`Could not find command: ${interaction.commandName}`);
  }
});

async function main() {
  subscriptions = await subscriptionService.list();
  bot.login(process.env.BOT_TOKEN);
  setInterval(checkSubscriptions, 30000, { client: bot, subscriptions, boardroomApi, subscriptionService });  
}

main();
