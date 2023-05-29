import { readFile, writeFile } from "fs/promises";
import { CandidateService } from "../domain/candidate.service";
import {
  candidatesArrayValidator,
  fromCandidateFileToDomain,
  fromDomainCandidateToFile,
  fromDomainVoteToFile,
  fromVoteFileToDomain,
} from "./mappers";
import {
  NotFoundCandidate,
  ShapeCandidateError,
} from "../domain/candidate.errors";
import { ZodError } from "zod";
import { Candidate, createVote } from "../domain/candidate";

export function buildCandidateFileRepository(
  filepath: string
): CandidateService {
  async function getCandidatesFromFile() {
    const fileContent = await readFile(filepath, { encoding: "utf8" });
    const candidates = candidatesArrayValidator.parse(JSON.parse(fileContent));
    return candidates;
  }

  return {
    async getAllCandidates() {
      try {
        const candidates = await getCandidatesFromFile();

        return candidates.map(fromCandidateFileToDomain);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ShapeCandidateError("Error with candidates format");
        }

        throw error;
      }
    },
    async getCandidateVotes(dni) {
      try {
        const fileContent = await readFile(filepath, { encoding: "utf8" });
        const candidates = candidatesArrayValidator.parse(
          JSON.parse(fileContent)
        );

        const expectedCandidate = candidates.find(
          (candidate) => candidate.dni === dni
        );
        if (!expectedCandidate) {
          throw new NotFoundCandidate(`Not found candidate with dni ${dni}`);
        }

        return expectedCandidate.votes.map(fromVoteFileToDomain);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ShapeCandidateError("Error with candidates format");
        }

        throw error;
      }
    },
    async registerVote(candidateDNI, citizenDNI) {
      try {
        const vote = createVote(citizenDNI);
        const candidates = await getCandidatesFromFile();
        const votedCandidate = candidates.find(
          (candidate) => candidate.dni === candidateDNI
        );
        if (!votedCandidate) {
          throw new NotFoundCandidate(
            `Not found candidate with DNI ${candidateDNI}`
          );
        }
        const candidatesWithNewVote = candidates.map((candidate) =>
          candidate.dni === candidateDNI
            ? {
                ...candidate,
                votes: [...votedCandidate.votes, fromDomainVoteToFile(vote)],
              }
            : candidate
        );

        await writeFile(filepath, JSON.stringify(candidatesWithNewVote));
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ShapeCandidateError("Error with candidates format");
        }

        throw error;
      }
    },
  };
}
