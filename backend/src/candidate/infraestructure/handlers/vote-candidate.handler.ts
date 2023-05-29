import { RequestHandler } from "express";
import { CandidateService } from "../../domain/candidate.service";
import { buildVoteForCandidate } from "../../application/vote-for-candidate.flow";
import { HTTP_CODES } from "../../../http-utills/constants/https-codes";
import {
  DuplicatedVoteError,
  NotFoundCandidate,
  ShapeCandidateError,
} from "../../domain/candidate.errors";
import { CitizenService } from "../../../citizen/domain/citizen.service";
import { NotFoundCitizenError } from "../../../citizen/domain/citizen.errors";
import {
  handleHTTPResponse,
  handleHTTPError,
} from "../../../http-utills/mappers";

type VoteForCandidateDependencies = {
  candidateService: CandidateService;
  citizenService: CitizenService;
};

export function voteForCandidate(
  dependencies: VoteForCandidateDependencies
): RequestHandler {
  return async (request, response) => {
    try {
      const voteInfo = request.body;
      const voteForCandidate = buildVoteForCandidate(dependencies);

      await voteForCandidate(voteInfo.citizen_dni, voteInfo.candidate_dni);

      response.status(HTTP_CODES.CREATED).json(handleHTTPResponse(voteInfo));
    } catch (error) {
      if (error instanceof ShapeCandidateError) {
        response
          .status(HTTP_CODES.SERVER_ERROR)
          .json(handleHTTPError("Error with candidate format"));
        return;
      }

      if (error instanceof NotFoundCandidate) {
        response
          .status(HTTP_CODES.NOT_FOUND)
          .json(handleHTTPError("Not found candidate"));
        return;
      }

      if (error instanceof NotFoundCitizenError) {
        response
          .status(HTTP_CODES.NOT_FOUND)
          .json(handleHTTPError("Not found citizen"));
        return;
      }

      if (error instanceof DuplicatedVoteError) {
        response
          .status(HTTP_CODES.BAD_REQUEST)
          .json(handleHTTPError("Citizen has already voted"));
        return;
      }

      response
        .status(HTTP_CODES.SERVER_ERROR)
        .json(handleHTTPError("Server internal error"));
    }
  };
}
