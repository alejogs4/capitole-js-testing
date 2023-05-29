import { build, perBuild } from "@jackfranklin/test-data-bot";
import { faker } from "@faker-js/faker";
import { Citizen } from "../../citizen/domain/citizen";

export const buildCitizen = build<Citizen>({
  fields: {
    id: perBuild(() => faker.string.uuid()),
    dni: perBuild(() => faker.string.uuid()),
    name: perBuild(() => faker.person.firstName()),
    lastname: perBuild(() => faker.person.lastName()),
    age: perBuild(() => faker.number.int()),
  },
});
