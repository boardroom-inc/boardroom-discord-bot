import * as Discord from 'discord.js';
import BoardRoomApiService from "./services/boardRoomApiService";
import { ISubscription } from "./models";
import SubscriptionService from './services/subscriptionService';

interface Params {
  client: Discord.Client;
  subscriptions: ISubscription[];
  boardroomApi: BoardRoomApiService;
  subscriptionService: SubscriptionService;
}

const checkSubscriptions = async ({ subscriptions, boardroomApi, client, subscriptionService }: Params) => {
  const now = new Date();

  for (let i = 0; i < subscriptions.length; i++) {
    const subscription = subscriptions[i];
    const channel = client.channels.cache.find(channel => channel.id === subscription.channelId);
    if (! channel || ! channel.isText()) {
      return;
    }

    const diffInHours = (now.valueOf() - subscription.lastCheck.valueOf()) / 1000 / 3600;
    if (diffInHours < subscription.frequency) {
      return;
    }

    subscription.lastCheck = now;

    switch (subscription.type) {
      case 'new_protocol': {
        const oldProtocols = subscription.protocols;
        const currentProtocols = await boardroomApi.listProtocols();
        const difference = currentProtocols.data.filter(protocol => ! oldProtocols.find(protocol2 => protocol2.cname === protocol.cname));

        if (difference.length > 0) {
          const message = `
New protocols for Boardroom!
{${difference.map(protocol => `- ${protocol.name} (${protocol.cname})`).join("\n")}}
          `.trim();
          channel.send(message);
        }

        subscription.protocols = currentProtocols.data;
        break;
      }

      case 'new_proposal': {
        const newProposals = await boardroomApi.listProtocolProposals(subscription.cname);
        const difference = newProposals.data.filter(proposal => {
          return proposal.startTime.timestamp > subscription.lastCheck.valueOf() / 1000;
        });

        if (difference.length > 0) {
          const message = `
New proposals for ${subscription.cname}}!
{${difference.map(proposal => `- \`${proposal.title}\` by (${proposal.proposer})`).join("\n")}}
          `.trim();
          channel.send(message);
        }
        break;
      }

      case 'new_proposal_vote': {
        const newVotes = await boardroomApi.listProposalVotes(subscription.refId);
        const difference = newVotes.data.filter(vote => {
          return vote.timestamp > subscription.lastCheck.valueOf() / 1000;
        });

        if (difference.length > 0) {
          const message = `
New votes in ${subscription.proposal.title}}!
{${difference.map(proposalVote => `- \`${proposalVote.address}\` voted ${subscription.proposal.choices[proposalVote.choice]}`).join("\n")}}
          `.trim();
          channel.send(message);
        }
        break;
      }

      case 'new_voter_vote': {
        const newVotes = await boardroomApi.listVoterVotes(subscription.address);
        const difference = newVotes.data.filter(vote => {
          return vote.timestamp > subscription.lastCheck.valueOf() / 1000;
        });

        if (difference.length > 0) {
          const message = `
New votes by ${subscription.address}}!
{${difference.map(voterVote => `- \`${subscription.address}\` voted \`${voterVote.proposalInfo.choices[voterVote.choice]} \` in ${voterVote.proposalInfo.title} (${voterVote.proposalInfo.refId})`).join("\n")}}
          `.trim();
          channel.send(message);
        }
        break;
      }

      case 'proposal_state': {
        const oldProposal = subscription.proposal;
        const newProposal = await boardroomApi.getProposalDetails(subscription.refId);

        if (oldProposal.currentState !== newProposal.data.currentState) {
          const message = `
Proposal ${newProposal.data.title} went from \`${oldProposal.currentState}\` to \`${newProposal.data.currentState}\`!
          `.trim();
          channel.send(message);
        }

        subscription.proposal = newProposal.data;
        break;

      }

      case 'stats': {
        const request = await boardroomApi.getStats();
        const oldStats = subscription.stats;
        const newStats = request.data;

        const oldTotalProposals = oldStats.totalProposals;
        const oldTotalProtocols = oldStats.totalProtocols;
        const oldTotalUniqueVoters = oldStats.totalUniqueVoters;
        const oldTotalVotesCast = oldStats.totalVotesCast;

        const totalProposals = newStats.totalProposals;
        const totalProtocols = newStats.totalProtocols;
        const totalUniqueVoters = newStats.totalUniqueVoters;
        const totalVotesCast = newStats.totalVotesCast;

        const totalProposalsDifference = totalProposals - oldTotalProposals;
        const totalProtocolsDifference = totalProtocols - oldTotalProtocols;
        const totalUniqueVotersDifference = totalUniqueVoters - oldTotalUniqueVoters;
        const totalVotesCastDifference = totalVotesCast - oldTotalVotesCast;

        let totalProposalsDifferenceText = '';
        let totalProtocolsDifferenceText = '';
        let totalUniqueVotersDifferenceText = '';
        let totalVotesCastDifferenceText = '';

        if (totalProposalsDifference > 0) {
          totalProposalsDifferenceText = '+' + totalProposalsDifference;
        } else if (totalProposalsDifference < 0) {
          totalProposalsDifferenceText = '-' + totalProposalsDifference;
        }

        if (totalProtocolsDifference > 0) {
          totalProtocolsDifferenceText = '+' + totalProtocolsDifference;
        } else if (totalProtocolsDifference < 0) {
          totalProtocolsDifferenceText = '-' + totalProtocolsDifference;
        }

        if (totalUniqueVotersDifference > 0) {
          totalUniqueVotersDifferenceText = '+' + totalUniqueVotersDifference;
        } else if (totalUniqueVotersDifference < 0) {
          totalUniqueVotersDifferenceText = '-' + totalUniqueVotersDifference;
        }

        if (totalVotesCastDifference > 0) {
          totalVotesCastDifferenceText = '+' + totalVotesCastDifference;
        } else if (totalVotesCastDifference < 0) {
          totalVotesCastDifferenceText = '-' + totalVotesCastDifference;
        }

        const message = `
BoardRoom's statistics:
Total Proposals: ${totalProposals.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${totalProposalsDifferenceText}
Total Protocols: ${totalProtocols.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${totalProtocolsDifferenceText}
Total Unique Voters: ${totalUniqueVoters.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${totalUniqueVotersDifferenceText}
Total Votes Cast: ${totalVotesCast.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${totalVotesCastDifferenceText}
        `.trim();

        channel.send(message);
        subscription.stats = newStats;
        break;
      }
    }

    await subscriptionService.update(subscription);
  }
};

export default checkSubscriptions;
