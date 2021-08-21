import { ICommand } from "../models";

const command: ICommand = {
  name: 'protocol_list',
  description: 'Lists all protocols supported by Boardroom',
  handler: async ({ interaction, boardroomApi }) => {
    try {
      await interaction.deferReply();
      const request = await boardroomApi.listProtocols();
      const reply = request.data
                               .map((protocol, index) => `[${index + 1}] \`${protocol.cname}\` - ${protocol.name}`)
                               .join("\n");
      await interaction.editReply(reply);
    } catch (e) {
      await interaction.editReply(`ERROR: ${e.message}`);
    }
  },
};

export default command;
