import { ApplicationCommandOptionType, CommandInteraction, TextBasedChannels } from "discord.js";
import BoardRoomApiService from "./services/boardRoomApiService";
import SubscriptionService from "./services/subscriptionService";

// SCHEMA

export interface IProtocolIcon {
  adapter: string;
  size: string;
  url: string;
}

export interface ITokenMarketPrice {
  currency: string;
  price: number;
}

export interface IToken {
  adapter: string;
  symbol: string;
  network: string;
  contractAddress: string;
  marketPrices: number;
}

export interface IProtocol {
  cname: string;
  name: string;
  totalProposals: number;
  totalVotes: number;
  uniqueVoters: number;
  icons: IProtocolIcon[];
  tokens: IToken[];
}

export interface IProposalTime {
  timestamp: number;
}

export interface IProposalResult {
  total: number;
  choice: number;
}

export interface IProposalVoteTime {
  blockNumber: number;
}

export interface IProposalVote {
  refId: string;
  proposalRefId: string;
  protocol: string;
  adapater: string;
  proposalId: string;
  address: string;
  power: number;
  reason: string;
  choice: number;
  time: IProposalVoteTime;
  timestamp: number;
}

export interface IProposal {
  refId: string;
  id: string;
  title: string;
  content: string;
  protocol: string;
  adapter: string;
  proposer: string;
  totalVotes: number;
  blockNumber: number;
  externalUrl: string;
  startTime: IProposalTime;
  endTime: IProposalTime;
  startTimestamp: number;
  endTimestamp: number;
  currentState: string;
  choices: string[];
  results: IProposalResult[];
  events: any;
}

export interface IVoterProtocol {
  protocol: string;
  totalVotesCast: number;
  lastVoteCast: number;
  firstVoteCast: number;
  totalPowerCast: number;
}

export interface IVoter {
  address: string;
  firstVoteCast: number;
  lastVoteCast: number;
  totalVotesCast: number;
  protocols: IVoterProtocol[];
}

export interface IVoterVote extends IProposalVote {
  proposalInfo: IProposal;
}

export interface IGlobalStats {
  totalProposals: number;
  totalProtocols: number;
  totalUniqueVoters: number;
  totalVotesCast: number;
}

// COMMANDS

export type ICommandHandlerArguments = {
  interaction: CommandInteraction;
  boardroomApi: BoardRoomApiService;
  subscriptionService: SubscriptionService;
  subscriptions: ISubscription[];
}

export type ICommandHandler = (args: ICommandHandlerArguments) => Promise<void> | void;

export interface ICommandOption {
  name: string;
  description: string;
  type?: ApplicationCommandOptionType;
  required?: boolean;
}

export interface ICommand { 
  name: string;
  description: string;
  required?: boolean;
  options?: ICommandOption[];
  handler: ICommandHandler;
}

//////// API

export interface SuccessResponse<T> {
  data: T;
}

// Looks like DynamoDB!

export interface ListSuccessResponse<T> extends SuccessResponse<T> {
  nextToken: number;
}

export interface PaginationOtions {
  cursor?: number;
  limit?: number;
}

export interface ListProtocolOptions extends PaginationOtions {
  pinned?: string[];
  cnames?: string[];
}

export interface ListProposalsOptions extends PaginationOtions {
  cname?: string[];
  status?: 'pending' | 'active' | 'closed';
}

export interface ListProtocolProposalsOptions extends PaginationOtions {
  status?: 'pending' | 'active' | 'closed';
}

export interface ListProposalsVotesOptions extends PaginationOtions {
  pinned?: string[];
}

export interface ListVoterVotesOptions extends PaginationOtions {
  cname?: string[];
}

// Subscriptions

export type ISubscriptionBase = {
  id: string;
  frequency: number;
  lastCheck: Date;
  channelId: string;
};

export type ISubscriptionNewProtocol = {
  type: 'new_protocol';
  protocols: IProtocol[];
};

export type ISubscriptionNewProposal = {
  type: 'new_proposal';
  cname: string;
};

export type ISubscriptionProposalVotes = {
  type: 'new_proposal_vote';
  refId: string;
  proposal: IProposal;
};

export type ISubscriptionVoterVotes = {
  type: 'new_voter_vote';
  address: string;
};

export type ISubscriptionProposalState = {
  type: 'proposal_state';
  refId: string;
  proposal: IProposal;
};

export type ISubscriptionStats = {
  type: 'stats';
  stats: IGlobalStats;
};

export type ISubscription = ISubscriptionBase & (
  ISubscriptionNewProtocol |
  ISubscriptionNewProposal |
  ISubscriptionVoterVotes |
  ISubscriptionProposalVotes |
  ISubscriptionProposalState |
  ISubscriptionStats
);
