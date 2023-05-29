import { CitizenService } from "../../citizen/domain/citizen.service";
import { buildCandidate } from "../../test-utils/builders/candidate-builder";
import { buildCitizen } from "../../test-utils/builders/citizen-builder";
import {
  buildMockCandidateService,
  buildMockCitizenService,
} from "../../test-utils/builders/services-builders";
import { DuplicatedVoteError } from "../domain/candidate.errors";
import { buildVoteForCandidate } from "./vote-for-candidate.flow";

describe("vote for candidate flow", () => {
  test("Should register vote if citizen has not voted", async () => {
    // Arrange
    const candidates = buildCandidate.many(5);
    const citizen = buildCitizen.one();

    const mockCandidateService = buildMockCandidateService();

    const mockCitizenService = buildMockCitizenService({
      findCitizenByDNI: jest.fn().mockResolvedValue(citizen),
    });

    const executeVoteForCandidate = buildVoteForCandidate({
      candidateService: mockCandidateService,
      citizenService: mockCitizenService,
    });

    // Act
    await executeVoteForCandidate(citizen.dni, candidates[0].dni);

    // Assert
    expect(mockCitizenService.findCitizenByDNI).toHaveBeenCalledWith(
      citizen.dni
    );
    expect(mockCandidateService.registerVote).toHaveBeenCalledTimes(1);
  });

  test("Should throw an error if citizen has already voted", async () => {
    // Arrange
    const candidates = buildCandidate.many(5);
    const citizen = buildCitizen.one();
    candidates[0].votes.push({
      citizenDNI: citizen.dni,
      createdAt: "",
    });

    const mockCandidateService = buildMockCandidateService({
      getAllCandidates: jest.fn().mockResolvedValue(candidates),
    });

    const mockCitizenService = buildMockCitizenService({
      findCitizenByDNI: jest.fn().mockResolvedValue(citizen),
    });

    const executeVoteForCandidate = buildVoteForCandidate({
      candidateService: mockCandidateService,
      citizenService: mockCitizenService,
    });

    try {
      // Act
      await executeVoteForCandidate(citizen.dni, candidates[0].dni);
      throw new Error("This should have thrown");
    } catch (error) {
      // Assert
      expect(error).toBeInstanceOf(DuplicatedVoteError);
    }
  });
});
