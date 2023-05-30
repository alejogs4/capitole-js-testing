import { ResultsService } from "../../modules/candidates-results/services/results.services";
import { ElectionService } from "../../modules/election/services/election.service";
import { buildFakeCandidate } from "./candidate-builder";
import { buildFakeCitizen } from "./citizen-builder";
import { buildFakeElectionResults } from "./results-builder";

export function buildMockElectionService(
  overrides: Partial<ElectionService> = {}
): ElectionService {
  return {
    getCandidates: jest.fn().mockResolvedValue(buildFakeCandidate.many(5)),
    getCitizenByDNI: jest.fn().mockResolvedValue(buildFakeCitizen()),
    voteCandidate: jest.fn(),
    ...overrides,
  };
}

export function buildMockResultsService(
  overrides: Partial<ResultsService> = {}
): ResultsService {
  return {
    getCandidatesResults: jest
      .fn()
      .mockResolvedValue(buildFakeElectionResults()),
    ...overrides,
  };
}
