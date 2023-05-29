import { buildCandidate } from "../../test-utils/builders/candidate-builder";
import { Candidate, hasCitizenVoted } from "./candidate";

describe("candidate tests", () => {
  describe("hasCitizenVoted", () => {
    test("Should return true if citizen has voted for a candidate", () => {
      // Arrange
      const CITIZEN_ID = "citizen-2";

      const candidates: Array<Candidate> = buildCandidate.many(2);
      candidates[1].votes.push({
        citizenDNI: CITIZEN_ID,
        createdAt: "",
      });

      // Act
      const hasVoted = hasCitizenVoted(candidates, CITIZEN_ID);

      // Assert
      expect(hasVoted).toBe(true);
    });

    test("Should return false if citizen has not voted for a candidate", () => {
      // Arrange
      const CITIZEN_ID = "citizen-3";
      const candidates: Array<Candidate> = buildCandidate.many(4);

      // Act
      const hasVoted = hasCitizenVoted(candidates, CITIZEN_ID);

      // Assert
      expect(hasVoted).toBe(false);
    });
  });
});
