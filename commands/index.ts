import { ICommand, ISubscription } from '../models';

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
        const details = await boardroomApi.getProposalDetails(refid);
        const request = await boardroomApi.listProposalVotes(refid);
        const choices = details.data.choices;
        let list = request.data.map(proposalVote => {
          return `
${new Date(proposalVote.timestamp * 1000).toUTCString()} - \`${proposalVote.address}\` voted \`${choices[proposalVote.choice]}\`
        `.trim();
        });
        if (list.length > 15) {
          const newItem = `+${list.length - 15} votes (https://app.boardroom.info/index/proposal/${refid})`;
          list = list.slice(0, 15);
          list.push(newItem);
        }

        const reply = list.length === 0 ? 'This proposal has no votes.' : `Votes for \`${details.data.title}\`: \n${list.join("\n")}`;
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

  {
    name: 'subscribe_to_protocols',
    description: 'Be notified any time a new protocol is added.',
    options: [
      {
        name: 'frequency',
        description: 'Frequency to check in hours (could be decimals too)',
        type: 'NUMBER',
        required: false,
      }
    ],
    handler: async ({ interaction, boardroomApi, subscriptions }) => {
      try {
        const channel = interaction.channel!;
        const frequency = interaction.options.getNumber('frequency', false) || 4 / 60;
        const type = 'new_protocol';

        const existing = subscriptions.find(subscription => subscription.channel.id === channel.id && subscription.type === type);
        if (existing) {
          interaction.reply('You are already subscribed to new protocols.');
          return;
        }

        await interaction.deferReply();

        const lastCheck = new Date();
        const request = await boardroomApi.listProtocols();
        const protocols = request.data;

        const newSubscription: ISubscription = { type, lastCheck, channel, frequency, protocols };
        subscriptions.push(newSubscription);

        await interaction.editReply('This channel will be notified every time there\'s a new protocol.');
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'subscribe_to_protocol_proposals',
    description: 'Be notified any time a new proposal is added.',
    options: [
      {
        name: 'cname',
        description: 'Code name for the protocol must be [a-z0-9] (e.g "uniswap")'
      },
      {
        name: 'frequency',
        description: 'Frequency to check',
        type: 'NUMBER',
        required: false,
      }
    ],
    handler: async ({ interaction, boardroomApi, subscriptions }) => {
      try {
        const channel = interaction.channel!;
        const cname = interaction.options.getString('cname', true);
        const frequency = interaction.options.getNumber('frequency', false) || 4 / 60;
        const type = 'new_proposal';

        const existing = subscriptions.find(subscription => {
          return subscription.channel.id === channel.id && subscription.type === type && subscription.cname === cname
        });
        if (existing) {
          interaction.reply(`You are already subscribed to new proposals at ${cname}`);
          return;
        }

        await interaction.deferReply();

        const lastCheck = new Date();
        await boardroomApi.getProtocol(cname); // just a confirmation that it exists.

        const newSubscription: ISubscription = { type, lastCheck, channel, frequency, cname };
        subscriptions.push(newSubscription);

        await interaction.editReply(`Subscribed to all new proposals at ${cname}!`);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'subscribe_to_proposal_state',
    description: 'Be notified any time the state of a proposal changes.',
    options: [
      {
        name: 'refid',
        description: 'Unique code representing proposal (ends with =)'
      },
      {
        name: 'frequency',
        description: 'Frequency to check',
        type: 'NUMBER',
        required: false,
      }
    ],
    handler: async ({ interaction, boardroomApi, subscriptions }) => {
      try {
        const channel = interaction.channel!;
        const refId = interaction.options.getString('refid', true);
        const frequency = interaction.options.getNumber('frequency', false) || 4 / 60;
        const type = 'proposal_state';

        const existing = subscriptions.find(subscription => {
          return subscription.channel.id === channel.id && subscription.type === type && subscription.refId === refId
        });
        if (existing) {
          interaction.reply(`You are already subscribed to state changes to \`${refId}\``);
          return;
        }

        await interaction.deferReply();

        const lastCheck = new Date();
        const request = await boardroomApi.getProposalDetails(refId);
        const proposal = request.data;

        const newSubscription: ISubscription = { type, lastCheck, channel, frequency, refId, proposal };
        subscriptions.push(newSubscription);

        await interaction.editReply(`Subscribed to state changes to \`${proposal.title}\`!`);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'subscribe_to_proposal_votes',
    description: 'Be notified any time a proposal has a new vote.',
    options: [
      {
        name: 'refid',
        description: 'Unique code representing proposal (ends with =)'
      },
      {
        name: 'frequency',
        description: 'Frequency to check',
        type: 'NUMBER',
        required: false,
      }
    ],
    handler: async ({ interaction, boardroomApi, subscriptions }) => {
      try {
        const channel = interaction.channel!;
        const refId = interaction.options.getString('refid', true);
        const frequency = interaction.options.getNumber('frequency', false) || 4 / 60;
        const type = 'new_proposal_vote';

        const existing = subscriptions.find(subscription => {
          return subscription.channel.id === channel.id && subscription.type === type && subscription.refId === refId
        });
        if (existing) {
          interaction.reply(`You are already subscribed to state changes to \`${refId}\``);
          return;
        }

        await interaction.deferReply();

        const lastCheck = new Date();
        const request = await boardroomApi.getProposalDetails(refId);
        const proposal = request.data;

        const newSubscription: ISubscription = { type, lastCheck, channel, frequency, refId, proposal };
        subscriptions.push(newSubscription);

        await interaction.editReply(`Subscribed to new votes for this proposal!`);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'subscribe_to_voter_votes',
    description: 'Be notified any time an address votes.',
    options: [
      {
        name: 'address',
        description: 'Address of the voter'
      },
      {
        name: 'frequency',
        description: 'Frequency to check',
        type: 'NUMBER',
        required: false,
      }
    ],
    handler: async ({ interaction, boardroomApi, subscriptions }) => {
      try {
        const channel = interaction.channel!;
        const address = interaction.options.getString('address', true);
        const frequency = interaction.options.getNumber('frequency', false) || 4 / 60;
        const type = 'new_voter_vote';

        const existing = subscriptions.find(subscription => {
          return subscription.channel.id === channel.id && subscription.type === type && subscription.address === address
        });
        if (existing) {
          interaction.reply(`You are already subscribed to state changes to \`${address}\``);
          return;
        }

        await interaction.deferReply();

        const lastCheck = new Date();
        await boardroomApi.getVoter(address); // just make sure it exists.

        const newSubscription: ISubscription = { type, lastCheck, channel, frequency, address };
        subscriptions.push(newSubscription);

        await interaction.editReply(`Subscribed to new votes by ${address}!`);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'subscribe_to_stats',
    description: 'Display statistics from time to time.',
    options: [
      {
        name: 'frequency',
        description: 'Frequency to check',
        type: 'NUMBER',
        required: false,
      }
    ],
    handler: async ({ interaction, boardroomApi, subscriptions }) => {
      try {
        const channel = interaction.channel!;
        const frequency = interaction.options.getNumber('frequency', false) || 4 / 60;
        const type = 'stats';

        const existing = subscriptions.find(subscription => subscription.channel.id === channel.id && subscription.type === type);
        if (existing) {
          interaction.reply(`You are already subscribed to stats on this channel`);
          return;
        }

        await interaction.deferReply();

        const lastCheck = new Date();
        const request = await boardroomApi.getStats();
        const stats = request.data;

        const newSubscription: ISubscription = { type, lastCheck, channel, frequency, stats };
        subscriptions.push(newSubscription);

        await interaction.editReply(`Subscribed to all statistics!`);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'show_all_subscriptions',
    description: 'Lists all active subscriptions.',
    handler: async ({ interaction, subscriptions }) => {
      try {
        const list = subscriptions.map((subscription, index) => {
          let result = `#${index + 1} - on channel ${subscription.channel.id} ~`;
          switch (subscription.type) {
            case 'new_proposal':
              result += `Every new proposal for ${subscription.cname}.`
              break;
            case 'new_protocol': {
              result += `Every time a new protocol is added to Boardroom.`;
              break;
            }
            case 'new_proposal_vote': {
              result += `Every time a new vote is added to \`${subscription.refId}\`.`;
              break;
            }
            case 'new_voter_vote': {
              result += `Every time a new vote is added by \`${subscription.address}\`.`;
              break;
            }
            case 'proposal_state': {
              result += `Every time the state of \`${subscription.proposal.title}\` changes.`;
              break;
            }
            case 'stats': {
              result += `Global Boadroom's statistics.`;
              break;
            }
          }

          result += ` Runs every ${subscription.frequency.toFixed(2)}hrs. Last run ${subscription.lastCheck.toUTCString()}`;
          return result;
        }).join("\n");

        const reply = list.length === 0 ? 'No active subscriptions' : `Active subscriptions: \n${list}`;
        interaction.reply(reply);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'delete_subscription',
    description: 'Delete a subscription',
    options: [
      {
        name: 'number',
        description: 'Number of the subscription (you can get it with /show_all_subscriptions'
      },
    ],
    handler: async ({ interaction, subscriptions }) => {
      try {
        const index = interaction.options.getNumber('number', true) - 1;
        subscriptions.splice(index, 1);
        await interaction.reply(`Removed subscription #${index}. Keep in mind the order other subscriptions changed.`);
      } catch (e) {
        await interaction.editReply(`ERROR: ${e.message}`);
      }
    },
  },

  {
    name: 'delete_all_subscriptions',
    description: 'Delete all subscriptions',
    handler: async ({ interaction, subscriptions }) => {
      subscriptions.length = 0;
      interaction.reply('Deleted all subscriptions.');
    },
  },
];

export default commands;
