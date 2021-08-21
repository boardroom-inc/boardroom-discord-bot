import { ICommand } from "../models";

const command: ICommand = {
  name: 'protocol_proposals',
  description: 'Lists all proposals in a protocol',
  options: [
    {
      name: 'cname',
      description: 'Code name for the protocol must be [a-z0-9] (e.g "uniswap")'
    }
  ],
  handler: async ({ interaction, boardroomApi }) => {
    const cname = interaction.options.getString('cname', true);
    try {
      await interaction.deferReply();
      const request = await boardroomApi.listProtocolProposals(cname);
      const reply = request.data.map((proposal, index) => {
        return `${index + 1 } - [\`${proposal.refId}\`]: ${proposal.title} (${proposal.currentState})`
      }).join("\n");
      await interaction.editReply(reply);
    } catch (e) {
      await interaction.editReply(`ERROR: ${e.message}`);
    }
  },
};

export default command;
