import fetch from 'node-fetch';
import { IGlobalStats, IProposal, IProposalVote, IProtocol, IVoter, IVoterVote, ListProposalsOptions, ListProposalsVotesOptions, ListProtocolOptions, ListProtocolProposalsOptions, ListSuccessResponse, ListVoterVotesOptions, PaginationOtions, SuccessResponse } from "./models";
import { buildQueryString } from './utils';

const API_VERSION = 'v1';
const API_URL = `https://api.boardroom.info/${API_VERSION}/`;

class BoardRoomApiService {
  async listProtocols(options?: ListProtocolOptions): Promise<ListSuccessResponse<IProtocol[]>> {
    const queryString = buildQueryString({ ...options });
    const response = await fetch(`${API_URL}/protocols?${queryString}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async listProposals(options?: ListProposalsOptions): Promise<ListSuccessResponse<IProposal[]>> {
    const queryString = buildQueryString({ ...options });
    const response = await fetch(`${API_URL}/proposals?${queryString}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async listProtocolProposals(cname: string, options?: ListProtocolProposalsOptions): Promise<ListSuccessResponse<IProposal[]>> {
    const queryString = buildQueryString({ ...options });
    const response = await fetch(`${API_URL}/protocols/${cname}/proposals?${queryString}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async listProtocolVoters(cname: string, options?: PaginationOtions): Promise<ListSuccessResponse<IVoter[]>> {
    const queryString = buildQueryString({ ...options });
    const response = await fetch(`${API_URL}/protocols/${cname}/voters?${queryString}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async listProposalVotes(refId: string, options?: ListProposalsVotesOptions): Promise<ListSuccessResponse<IProposalVote[]>> {
    const queryString = buildQueryString({ ...options });
    const response = await fetch(`${API_URL}/proposals/${refId}/votes?${queryString}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async listVoters(options?: PaginationOtions): Promise<ListSuccessResponse<IVoter[]>> {
    const queryString = buildQueryString({ ...options });
    const response = await fetch(`${API_URL}/voters/?${queryString}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async listVoterVotes(address: string, options?: ListVoterVotesOptions): Promise<ListSuccessResponse<IVoterVote[]>> {
    const queryString = buildQueryString({ ...options });
    const response = await fetch(`${API_URL}/voters/${address}/votes?${queryString}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async getProtocol(cname: string): Promise<SuccessResponse<IProtocol>> {
    const response = await fetch(`${API_URL}/protocols/${cname}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async getProposalDetails(refId: string): Promise<SuccessResponse<IProposal>> {
    const response = await fetch(`${API_URL}/proposals/${refId}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async getVoter(address: string): Promise<SuccessResponse<IVoter>> {
    const response = await fetch(`${API_URL}/voters/${address}`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }

  async getStats(): Promise<SuccessResponse<IGlobalStats>> {
    const response = await fetch(`${API_URL}/stats`);
    const result = await response.json();
    if (result.message) {
      throw new Error(result.message);
    }

    return result;
  }
}

export default BoardRoomApiService;
