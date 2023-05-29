import { CitizenService } from "../../citizen/domain/citizen.service";
import { DuplicatedVoteError } from "../domain/candidate.errors";
import { CandidateService } from "../domain/candidate.service";

type VoteForCandidateDependencies = {
  candidateService: CandidateService;
  citizenService: CitizenService;
};

export function buildVoteForCandidate({
  candidateService,
  citizenService,
}: VoteForCandidateDependencies) {
  return async (citizenDNI: string, candidateDNI: string): Promise<void> => {
    await citizenService.findCitizenByDNI(citizenDNI);

    const allCandidates = await candidateService.getAllCandidates();
    const candidatesVoters = allCandidates.flatMap((candidate) =>
      candidate.votes.map((vote) => vote.citizenDNI)
    );

    if (candidatesVoters.includes(citizenDNI)) {
      throw new DuplicatedVoteError("Cannot vote twice");
    }

    await candidateService.registerVote(candidateDNI, citizenDNI);
  };
}
