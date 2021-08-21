import { ICommand } from '../models';

const commands: ICommand[] = [
  {
    name: 'protocol_list',
    description: 'Lists all protocols supported by Boardroom',
    handler: async ({ interaction, boardroomApi }) => {
      try {
        await interaction.deferReply();
        const request = await boardroomApi.listProtocols();
        const list = request.data
                                 .map((protocol, index) => `[${index + 1}] \`${protocol.cname}\` - ${protocol.name}`)
                                 .join("\n");
        const reply = `Boardroom's supported protocols: \n${list}`;
        await interaction.editReply(reply);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
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
        const list = request.data.map((proposal, index) => {
          return `${index + 1 } - [\`${proposal.refId}\`]: ${proposal.title} (${proposal.currentState})`
        }).join("\n");
        const reply = `${cname}'s proposals: \n${list}`;
        await interaction.editReply(reply);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'protocol_voters',
    description: 'Lists all voters in a protocol',
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
        const request = await boardroomApi.listProtocolVoters(cname);
        const reply = request.data.map((voter, index) => {
          return `${index + 1} - \`${voter.address}\``;
        }).join("\n");
        await interaction.editReply(reply);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'proposal_votes',
    description: 'Lists all voters in a protocol',
    options: [
      {
        name: 'refid',
        description: 'Unique code representing proposal (ends with =)'
      }
    ],
    handler: async ({ interaction, boardroomApi }) => {
      const refid = interaction.options.getString('refid', true);
      try {
        await interaction.deferReply();
        const request = await boardroomApi.listProposalVotes(refid);
        const list = request.data.map((proposalVote, index) => {
          return `
${index + 1 } - \`${proposalVote.address}\` voted ${proposalVote.choice} with \`${proposalVote.power}\` of power at ${new Date(proposalVote.timestamp * 1000).toUTCString()}
        `.trim();
        }).join("\n");
        const reply = list.length === 0 ? 'This proposal has no votes.' : `Votes for proposal: \n${list}`;
        await interaction.editReply(reply);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
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
  },

  {
    name: 'proposal_get',
    description: 'Retrieves information about a specific proposal.',
    options: [
      {
        name: 'refid',
        description: 'Unique code representing proposal (ends with =)'
      }
    ],
    handler: async ({ interaction, boardroomApi }) => {
      const refId = interaction.options.getString('refid', true);
      try {
        await interaction.deferReply();
        const request = await boardroomApi.getProposalDetails(refId);
        const proposal = request.data;
        const reply = `
${proposal.title} (${proposal.currentState}) by ${proposal.proposer}:
${proposal.content.trim()}
Choices:
${proposal.choices.map((choice, index) => `- ${index}: ${choice}`).join("\n")}
From ${new Date(proposal.startTimestamp * 1000).toUTCString()} until ${new Date(proposal.endTimestamp * 1000).toUTCString()}
        `.trim();
        await interaction.editReply(reply);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'voters_votes',
    description: 'Retrieves the votes of a specific address.',
    options: [
      {
        name: 'address',
        description: 'Address of the voer'
      }
    ],
    handler: async ({ interaction, boardroomApi }) => {
      const address = interaction.options.getString('address', true);
      try {
        await interaction.deferReply();
        const request = await boardroomApi.listVoterVotes(address);
        const voterVotes = request.data;
        const list = voterVotes.map(voterVote => {
          return `- Voted \`${voterVote.choice}\` in \`${voterVote.proposalInfo.title}\` (\`${voterVote.proposalRefId}\`) on ${new Date(voterVote.timestamp * 1000).toUTCString()}`
        });
        const reply = list.length === 0 ? `${address} has never voted.` : `Votes by ${address}:\n${list}`;
        await interaction.editReply(reply);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'voters_get',
    description: 'Retrieves information about a voter.',
    options: [
      {
        name: 'address',
        description: 'Address of the voter'
      }
    ],
    handler: async ({ interaction, boardroomApi }) => {
      const address = interaction.options.getString('address', true);
      try {
        await interaction.deferReply();
        const request = await boardroomApi.getVoter(address);
        const voter = request.data;
        const reply = `
Voter ${voter.address}:\n
First vote casted: ${new Date(voter.firstVoteCast * 1000).toUTCString()}
Last vote casted: ${new Date(voter.firstVoteCast * 1000).toUTCString()}
Total votes casted: ${voter.totalVotesCast}\n
Protocols:
${voter.protocols.map(protocol => `- \`${protocol.protocol}\` - ${protocol.totalVotesCast} total votes`).join("\n")}
        `.trim();
        await interaction.editReply(reply);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'stats',
    description: 'Prints Boardroom\'s global statistics.',
    handler: async ({ interaction, boardroomApi }) => {
      try {
        await interaction.deferReply();
        const request = await boardroomApi.getStats();
        const stats = request.data;
        const reply = `
Total Proposals: ${stats.totalProposals.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
Total Protocols: ${stats.totalProtocols.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
Total Unique Voters: ${stats.totalUniqueVoters.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
Total Votes Cast: ${stats.totalVotesCast.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        `.trim();
        await interaction.editReply(reply);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

];

export default commands;
