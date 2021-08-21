import { ICommand } from "../models";

const command: ICommand = {
  name: 'protocol_list',
  description: 'Lists all protocols supported by Boardroom',
  handler: ({ interaction }) => {
    interaction.reply('I ought to list you the protocols');
  },
};

export default command;
