import { build, perBuild } from '@jackfranklin/test-data-bot'
import { faker } from '@faker-js/faker'
import { Citizen } from '../../types/citizen'

export const buildFakeCitizen = build<Citizen>({
  fields: {
    id: perBuild(() => faker.string.uuid()),
    dni: perBuild(() => faker.string.uuid()),
    age: perBuild(() => faker.number.int()),
    lastname: perBuild(() => faker.person.lastName()),
    name: perBuild(() => faker.person.firstName())
  }
})