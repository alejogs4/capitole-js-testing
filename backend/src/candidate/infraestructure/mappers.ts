import { z } from "zod";
import { Candidate, Vote } from "../domain/candidate";

export const candidateShapeValidator = z.object({
  id: z.string(),
  dni: z.string(),
  name: z.string(),
  lastname: z.string(),
  political_party: z.string(),
  age: z.number(),
  votes: z.array(
    z.object({
      citizen_dni: z.string(),
      created_at: z.string(),
    })
  ),
});

export const candidatesArrayValidator = z.array(candidateShapeValidator);

type CandidateFromFile = z.infer<typeof candidateShapeValidator>;

type UnwrapArray<T> = T extends Array<infer El> ? El : never;

export function fromVoteFileToDomain(
  vote: UnwrapArray<CandidateFromFile["votes"]>
): Vote {
  return {
    citizenDNI: vote.citizen_dni,
    createdAt: vote.created_at,
  };
}

export function fromDomainVoteToFile(
  vote: Vote
): UnwrapArray<CandidateFromFile["votes"]> {
  return {
    citizen_dni: vote.citizenDNI,
    created_at: vote.createdAt,
  };
}

export function fromCandidateFileToDomain(
  candidate: CandidateFromFile
): Candidate {
  return {
    id: candidate.id,
    dni: candidate.dni,
    age: candidate.age,
    name: candidate.name,
    lastname: candidate.lastname,
    politicalParty: candidate.political_party,
    votes: candidate.votes.map(fromVoteFileToDomain),
  };
}

export function fromDomainCandidateToFile(
  candidate: Candidate
): CandidateFromFile {
  return {
    id: candidate.id,
    age: candidate.age,
    dni: candidate.dni,
    lastname: candidate.lastname,
    name: candidate.name,
    political_party: candidate.politicalParty,
    votes: candidate.votes.map(fromDomainVoteToFile),
  };
}
