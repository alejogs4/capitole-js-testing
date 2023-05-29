import { Candidate, Vote } from "./candidate";

export interface CandidateService {
  getAllCandidates(): Promise<Array<Candidate>>;
  getCandidateVotes(dni: string): Promise<Array<Vote>>;
  registerVote(candidateDNI: string, citizenDNI: string): Promise<void>;
}
