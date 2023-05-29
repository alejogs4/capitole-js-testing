import { RequestHandler } from "express";
import { CandidateService } from "../../domain/candidate.service";
import { buildGetCandidateVotesUseCase } from "../../application/get-candidates-votes.flow";
import { HTTP_CODES } from "../../../http-utills/constants/https-codes";
import { ShapeCandidateError } from "../../domain/candidate.errors";
import {
  handleHTTPResponse,
  handleHTTPError,
} from "../../../http-utills/mappers";

type GetAllCandidatesVotes = {
  candidateService: CandidateService;
};

export function getAllCandidatesVotes(
  services: GetAllCandidatesVotes
): RequestHandler {
  return async (_, response) => {
    try {
      const getCandidatesResults = buildGetCandidateVotesUseCase(services);
      const candidatesResults = await getCandidatesResults();

      response
        .status(HTTP_CODES.OK)
        .json(handleHTTPResponse(candidatesResults));
    } catch (error) {
      if (error instanceof ShapeCandidateError) {
        response
          .status(HTTP_CODES.SERVER_ERROR)
          .json(handleHTTPError("Error with candidate format"));
        return;
      }

      response
        .status(HTTP_CODES.SERVER_ERROR)
        .json(handleHTTPError("Server internal error"));
    }
  };
}
