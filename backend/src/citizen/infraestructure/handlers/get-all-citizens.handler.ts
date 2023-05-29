import { HTTP_CODES } from "../../../http-utills/constants/https-codes";
import {
  handleHTTPError,
  handleHTTPResponse,
} from "../../../http-utills/mappers";
import { ShapeValidationError } from "../../domain/citizen.errors";
import { CitizenService } from "../../domain/citizen.service";
import { RequestHandler } from "express";

type GetAllCitizensHandlerDependencies = {
  citizenService: CitizenService;
};

export function getAllCitizensHandler({
  citizenService,
}: GetAllCitizensHandlerDependencies): RequestHandler {
  return async (_, response) => {
    try {
      const citizens = await citizenService.getRegisteredCitizens();
      response.status(HTTP_CODES.OK).json(handleHTTPResponse(citizens));
    } catch (error) {
      if (error instanceof ShapeValidationError) {
        response
          .status(HTTP_CODES.SERVER_ERROR)
          .json(handleHTTPError("Stored info shape is wrong"));
        return;
      }

      response
        .status(HTTP_CODES.SERVER_ERROR)
        .json(handleHTTPError("Server error"));
    }
  };
}
