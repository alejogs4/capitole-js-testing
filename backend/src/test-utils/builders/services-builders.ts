import { CandidateService } from "../../candidate/domain/candidate.service";
import { CitizenService } from "../../citizen/domain/citizen.service";
import { buildCandidate } from "./candidate-builder";
import { buildCitizen } from "./citizen-builder";

export function buildMockCandidateService(
  overrides: Partial<CandidateService> = {}
): CandidateService {
  const candidates = buildCandidate.many(5);

  return {
    getAllCandidates: jest.fn().mockResolvedValue(candidates),
    getCandidateVotes: jest.fn(),
    registerVote: jest.fn(),
    ...overrides,
  };
}

export function buildMockCitizenService(
  overrides: Partial<CitizenService> = {}
): CitizenService {
  const citizen = buildCitizen.one();

  return {
    findCitizenByDNI: jest.fn().mockResolvedValue(citizen),
    getRegisteredCitizens: jest.fn(),
    ...overrides,
  };
}
