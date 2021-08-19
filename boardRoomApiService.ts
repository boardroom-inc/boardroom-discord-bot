const API_VERSION = 'v1';
const API_URL = `https://api.boardroom.info/${API_VERSION}/`;

class BoardRoomApiService {
  async listProtocols(): Promise<IProtocol[]> {
    const response = await fetch(API_URL + '/protocols');
    const result = await response.json();
    return result.data;
  }

  async listProposals(): Promise<IProposal[]> {
    const response = await fetch(API_URL + '/proposals');
    const result = await response.json();
    return result.data;
  }

  async listProtocolProposals(cname: string): Promise<IProposal[]> {
    const response = await fetch(`${API_URL}/protocols/${cname}/proposals`);
    const result = await response.json();
    return result.data;
  }

  async listProposalVotes(refId: string): Promise<IProposalVote[]> {
    const response = await fetch(`${API_URL}/protocols/${refId}/votes`);
    const result = await response.json();
    return result.data;
  }

  async listVoters(): Promise<IVoter[]> {
    const response = await fetch(`${API_URL}/voters/`);
    const result = await response.json();
    return result.data;
  }

  async listVoterVotes(address: string): Promise<IVoterVote[]> {
    const response = await fetch(`${API_URL}/voters/${address}/votes`);
    const result = await response.json();
    return result.data;
  }

  async getProtocol(cname: string): Promise<IProtocol> {
    const response = await fetch(`${API_URL}/protocols/${cname}`);
    const result = await response.json();
    return result.data;
  }

  async getProposalDetails(refId: string): Promise<IProposal> {
    const response = await fetch(`${API_URL}/protocols/${refId}`);
    const result = await response.json();
    return result.data;
  }

  async getStats(): Promise<IGlobalStats> {
    const response = await fetch(`${API_URL}/stats`);
    const result = await response.json();
    return result.data;
  }
}

export default BoardRoomApiService;
