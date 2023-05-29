import { readFile } from "fs/promises";
import { CitizenService } from "../domain/citizen.service";
import { citizensArrayValidator, fromFileCitizenToDomain } from "./mappers";
import {
  NotFoundCitizenError,
  ShapeValidationError,
} from "../domain/citizen.errors";
import { ZodError } from "zod";

export function buildFileCitizenRepository(filepath: string): CitizenService {
  return {
    async findCitizenByDNI(dni) {
      try {
        const fileContent = await readFile(filepath, { encoding: "utf-8" });
        const citizens = citizensArrayValidator.parse(JSON.parse(fileContent));

        const expectedCitizen = citizens.find((citizen) => citizen.dni === dni);
        if (!expectedCitizen) {
          throw new NotFoundCitizenError(
            `Citizen with dni: ${dni} was not found`
          );
        }

        return fromFileCitizenToDomain(expectedCitizen);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ShapeValidationError();
        }

        throw error;
      }
    },
    async getRegisteredCitizens() {
      try {
        const fileContent = await readFile(filepath, { encoding: "utf-8" });
        const citizens = citizensArrayValidator.parse(JSON.parse(fileContent));

        return citizens.map(fromFileCitizenToDomain);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ShapeValidationError();
        }

        throw error;
      }
    },
  };
}
