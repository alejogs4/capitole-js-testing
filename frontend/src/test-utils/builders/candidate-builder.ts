import { build, perBuild } from '@jackfranklin/test-data-bot'
import { faker } from '@faker-js/faker'
import { Candidate } from '../../types/candidate'

export const buildFakeCandidate = build<Candidate>({
  fields: {
    id: perBuild(() => faker.string.uuid()),
    dni: perBuild(() => faker.string.uuid()),
    age: perBuild(() => faker.number.int()),
    lastname: perBuild(() => faker.person.lastName()),
    name: perBuild(() => faker.person.firstName()),
    politicalParty: perBuild(() => faker.company.name()),
    votes: [
      {
        citizenDNI: perBuild(() => faker.string.uuid()),
        createdAt: "",
      },
    ]
  }
})