import { z } from "zod";
import { Citizen } from "../domain/citizen";

export const citizenFileValidator = z.object({
  user_name: z.string(),
  last_name: z.string(),
  id: z.string(),
  dni: z.string(),
  age: z.number(),
});

export const citizensArrayValidator = z.array(citizenFileValidator);

type CitizenFromFile = z.infer<typeof citizenFileValidator>;

export function fromFileCitizenToDomain(fileCitizen: CitizenFromFile): Citizen {
  return {
    age: fileCitizen.age,
    dni: fileCitizen.dni,
    id: fileCitizen.id,
    lastname: fileCitizen.last_name,
    name: fileCitizen.user_name,
  };
}

export function fromCitizenDomainToFile(citizen: Citizen): CitizenFromFile {
  return {
    age: citizen.age,
    dni: citizen.dni,
    id: citizen.id,
    last_name: citizen.lastname,
    user_name: citizen.name
  };
}
