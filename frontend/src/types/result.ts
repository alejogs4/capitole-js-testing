export type CandidateResult = {
  candidate: {
    id: string;
    dni: string;
    age: number;
    name: string;
    lastname: string;
    politicalParty: string;
  };
  totalVotes: number;
  percentage: number;
};

export type ElectionResult = {
  total: number;
  results: Array<CandidateResult>;
};
