import { build, perBuild } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker";
import { ElectionResult } from "../../types/result";

export const buildFakeElectionResults = build<ElectionResult>({
  fields: {
    total: perBuild(() => faker.number.int({ min: 1, max: 5 })),
    results: [
      {
        candidate: {
          age: faker.number.int(),
          dni: faker.string.uuid(),
          id: faker.string.uuid(),
          lastname: faker.person.lastName(),
          name: faker.person.firstName(),
          politicalParty: faker.company.name(),
        },
        percentage: perBuild(() => faker.number.float()),
        totalVotes: perBuild(() => faker.number.int({ min: 1, max: 5 })),
      },
    ],
  },
});
