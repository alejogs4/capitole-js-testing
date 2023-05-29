export type Candidate = {
  id: string;
  dni: string;
  age: number;
  name: string;
  lastname: string;
  politicalParty: string;
  votes: Vote[];
};

export type Vote = {
  citizenDNI: string;
  createdAt: string;
};
