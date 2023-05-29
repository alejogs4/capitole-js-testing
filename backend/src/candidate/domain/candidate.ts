export type Vote = {
  citizenDNI: string;
  createdAt: string;
};

export type Candidate = {
  id: string;
  dni: string;
  name: string;
  lastname: string;
  politicalParty: string;
  age: number;
  votes: Array<Vote>;
};

export function createVote(citizenDNI: string): Vote {
  return {
    citizenDNI: citizenDNI,
    createdAt: new Date().toUTCString(),
  };
}

export function hasCitizenVoted(
  candidates: Array<Candidate>,
  citizenDNI: string
): boolean {
  const candidatesVoters = candidates.flatMap((candidate) =>
    candidate.votes.map((vote) => vote.citizenDNI)
  );
  return candidatesVoters.includes(citizenDNI);
}