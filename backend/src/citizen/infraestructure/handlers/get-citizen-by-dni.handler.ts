import { RequestHandler } from "express";
import { CitizenService } from "../../domain/citizen.service";
import { HTTP_CODES } from "../../../http-utills/constants/https-codes";
import {
  NotFoundCitizenError,
  ShapeValidationError,
} from "../../domain/citizen.errors";
import {
  handleHTTPError,
  handleHTTPResponse,
} from "../../../http-utills/mappers";

type GetCitizenByDNIDependencies = {
  citizenService: CitizenService;
};

export function getCitizenByDNI({
  citizenService,
}: GetCitizenByDNIDependencies): RequestHandler {
  return async (request, response) => {
    try {
      const dni = request.params.dni;
      if (!dni) {
        response
          .status(HTTP_CODES.BAD_REQUEST)
          .json(handleHTTPError("DNI param not present"));
        return;
      }

      const citizen = await citizenService.findCitizenByDNI(dni);
      response.status(HTTP_CODES.OK).json(handleHTTPResponse(citizen));
    } catch (error) {
      if (error instanceof ShapeValidationError) {
        response
          .status(HTTP_CODES.SERVER_ERROR)
          .json(handleHTTPError("Info shape is wrong"));
        return;
      }

      if (error instanceof NotFoundCitizenError) {
        response
          .status(HTTP_CODES.NOT_FOUND)
          .json(handleHTTPError("Citizen with provided DNI does not exist"));
        return;
      }

      response
        .status(HTTP_CODES.SERVER_ERROR)
        .json(handleHTTPError("Server internal error"));
    }
  };
}
