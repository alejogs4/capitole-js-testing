import { build, perBuild } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker";
import { Candidate } from "../../candidate/domain/candidate";

export const buildCandidate = build<Candidate>({
  fields: {
    id: perBuild(() => faker.string.uuid()),
    dni: perBuild(() => faker.string.uuid()),
    name: perBuild(() => faker.person.firstName()),
    lastname: perBuild(() => faker.person.lastName()),
    age: perBuild(() => faker.number.int()),
    politicalParty: perBuild(() => faker.company.name()),
    votes: [
      {
        citizenDNI: faker.string.uuid(),
        createdAt: "",
      },
    ],
  },
});
