import { ICommand } from "../models";

const command: ICommand = {
  name: 'protocol_get',
  description: 'Retrieves information about a specific protocol.',
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
      const request = await boardroomApi.getProtocol(cname);
      const protocol = request.data;
      const reply = `
${protocol.name} (\`${protocol.cname}\`)
Total Proposals: ${protocol.totalProposals}
Total Votes: ${protocol.totalVotes}
Unique Voters: ${protocol.uniqueVoters}
Tokens:
${protocol.tokens.map(token => `- ${token.symbol.toUpperCase()} in ${token.network} [\`${token.contractAddress}\`]`).join("\n")}
      `.trim();
      await interaction.editReply(reply);
    } catch (e) {
      await interaction.editReply(`ERROR: ${e.message}`);
    }
  },
};

export default command;
