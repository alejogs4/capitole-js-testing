import { buildFakeCandidate } from "../../test-utils/builders/candidate-builder"
import { buildFakeCitizen } from "../../test-utils/builders/citizen-builder"
import { citizenPreviouslyVoted } from "./vote-candidates"

describe('Vote candidate tests', () => {
  describe('citizenPreviouslyVoted tests', () => {
    test('Should return true if citizen has already voted', () => {
      // Arrange
      const citizen = buildFakeCitizen()
      const candidates = buildFakeCandidate.many(5)

      candidates[0].votes.push({
        citizenDNI: citizen.dni,
        createdAt: '',
      })

      // Act
      const votedBefore = citizenPreviouslyVoted(citizen, candidates)

      // Assert
      expect(votedBefore).toBe(true)
    })

    test('Should return false if citizen has not voted', () => {
      // Arrange
      const citizen = buildFakeCitizen()
      const candidates = buildFakeCandidate.many(5)

      // Act
      const votedBefore = citizenPreviouslyVoted(citizen, candidates)

      // Assert
      expect(votedBefore).toBe(false)
    })
  })
})