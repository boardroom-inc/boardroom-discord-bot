import { IGlobalStats, IProposal, IProposalVote, IProtocol, IVoter, IVoterVote, ListProposalsOptions, ListProposalsVotesOptions, ListProtocolOptions, ListProtocolProposalsOptions, ListSuccessResponse, ListVoterVotesOptions, PaginationOtions, SuccessResponse } from "./models";
declare class BoardRoomApiService {
    listProtocols(options?: ListProtocolOptions): Promise<ListSuccessResponse<IProtocol[]>>;
    listProposals(options?: ListProposalsOptions): Promise<ListSuccessResponse<IProposal[]>>;
    listProtocolProposals(cname: string, options?: ListProtocolProposalsOptions): Promise<ListSuccessResponse<IProposal[]>>;
    listProtocolVoters(cname: string, options?: PaginationOtions): Promise<ListSuccessResponse<IProposal[]>>;
    listProposalVotes(refId: string, options?: ListProposalsVotesOptions): Promise<ListSuccessResponse<IProposalVote[]>>;
    listVoters(options?: PaginationOtions): Promise<ListSuccessResponse<IVoter[]>>;
    listVoterVotes(address: string, options?: ListVoterVotesOptions): Promise<ListSuccessResponse<IVoterVote[]>>;
    getProtocol(cname: string): Promise<SuccessResponse<IProtocol>>;
    getProposalDetails(refId: string): Promise<SuccessResponse<IProposal>>;
    getStats(): Promise<SuccessResponse<IGlobalStats>>;
}
export default BoardRoomApiService;
