import { Candidate } from "../domain/candidate";
import { CandidateService } from "../domain/candidate.service";

type BuildGetCandidateVotesDependencies = {
  candidateService: CandidateService;
};

type CandidatesResults = {
  total: number;
  results: {
    candidate: Omit<Candidate, "votes">;
    totalVotes: number;
    percentage: number;
  }[];
};

export function buildGetCandidateVotesUseCase({
  candidateService,
}: BuildGetCandidateVotesDependencies) {
  return async (): Promise<CandidatesResults> => {
    const candidates = await candidateService.getAllCandidates();

    const allVotes = candidates.flatMap((candidate) => candidate.votes);

    const candidatesResults = candidates.map((candidate) => {
      const { votes, ...candidateInfo } = candidate;
      return {
        candidate: candidateInfo,
        totalVotes: votes.length,
        percentage: votes.length / allVotes.length || 0,
      };
    });

    return {
      total: allVotes.length,
      results: candidatesResults,
    };
  };
}
