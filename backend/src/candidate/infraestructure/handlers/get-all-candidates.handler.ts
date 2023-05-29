import { RequestHandler } from "express";
import { CandidateService } from "../../domain/candidate.service";
import { HTTP_CODES } from "../../../http-utills/constants/https-codes";
import { ShapeCandidateError } from "../../domain/candidate.errors";
import {
  handleHTTPResponse,
  handleHTTPError,
} from "../../../http-utills/mappers";

type GetAllCandidatesDependencies = {
  candidateService: CandidateService;
};

export function getAllCandidates({
  candidateService,
}: GetAllCandidatesDependencies): RequestHandler {
  return async (_, response) => {
    try {
      const candidates = await candidateService.getAllCandidates();
      response.status(HTTP_CODES.OK).json(handleHTTPResponse(candidates));
    } catch (error) {
      const errorMessage =
        error instanceof ShapeCandidateError
          ? "candidates with wrong format"
          : "Server internal error";

      response
        .status(HTTP_CODES.SERVER_ERROR)
        .json(handleHTTPError(errorMessage));
    }
  };
}
