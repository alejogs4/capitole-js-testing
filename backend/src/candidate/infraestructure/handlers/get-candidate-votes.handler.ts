import { RequestHandler } from "express";
import { CandidateService } from "../../domain/candidate.service";
import { HTTP_CODES } from "../../../http-utills/constants/https-codes";
import {
  NotFoundCandidate,
  ShapeCandidateError,
} from "../../domain/candidate.errors";
import {
  handleHTTPError,
  handleHTTPResponse,
} from "../../../http-utills/mappers";

type GetCandidateVotesDependencies = {
  candidateService: CandidateService;
};

export function getCandidateVotes({
  candidateService,
}: GetCandidateVotesDependencies): RequestHandler {
  return async (request, response) => {
    try {
      const dni = request.params.dni;
      if (!dni) {
        response
          .status(HTTP_CODES.BAD_REQUEST)
          .json(handleHTTPError("Dni not present"));
        return;
      }

      const candidateVotes = await candidateService.getCandidateVotes(dni);
      response.status(HTTP_CODES.OK).json(handleHTTPResponse(candidateVotes));
    } catch (error) {
      if (error instanceof NotFoundCandidate) {
        response
          .status(HTTP_CODES.NOT_FOUND)
          .json(handleHTTPError("not found candidate"));
        return;
      }

      const errorMessage =
        error instanceof ShapeCandidateError
          ? "Candidates wrong format"
          : "Internal server error";

      response
        .status(HTTP_CODES.SERVER_ERROR)
        .json(handleHTTPError(errorMessage));
    }
  };
}
