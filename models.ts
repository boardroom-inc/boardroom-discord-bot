interface IProtocolIcon {
  adapter: string;
  size: string;
  url: string;
}

interface ITokenMarketPrice {
  currency: string;
  price: number;
}

interface IToken {
  adapter: string;
  symbol: string;
  network: string;
  contractAddress: string;
  marketPrices: number;
}

interface IProtocol {
  cname: string;
  name: string;
  totalProposals: number;
  totalVotes: number;
  uniqueVoters: number;
  icons: IProtocolIcon[];
  tokens: IToken[];
}

interface IProposalTime {
  timestamp: number;
}

interface IProposalResult {
  total: number;
  choice: number;
}

interface IProposalVoteTime {
  blockNumber: number;
}

interface IProposalVote {
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

interface IProposal {
  refId: string;
  id: string;
  title: string;
  content: string;
  protocol: string;
  adaptar: string;
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

interface IVoterProtocol {
  protocol: string;
  totalVotesCast: number;
  lastVoteCast: number;
  firstVoteCast: number;
  totalPowerCast: number;
}

interface IVoter {
  address: string;
  firstVoteCast: number;
  lastVoteCast: number;
  totalVotesCast: number;
  protocols: IVoterProtocol[];
}

interface IVoterVote extends IProposalVote {
  proposalInfo: IProposal;
}

interface IGlobalStats {
  totalProposals: number;
  totalProtocols: number;
  totalUniqueVoters: number;
  totalVotesCast: number;
}
