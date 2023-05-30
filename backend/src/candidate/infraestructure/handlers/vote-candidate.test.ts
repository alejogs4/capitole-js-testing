import { createRequest, createResponse } from "node-mocks-http";
import {
  buildMockCandidateService,
  buildMockCitizenService,
} from "../../../test-utils/builders/services-builders";
import { voteForCandidate } from "./vote-candidate.handler";
import { HTTP_CODES } from "../../../http-utills/constants/https-codes";
import {
  NotFoundCandidate,
  ShapeCandidateError,
} from "../../domain/candidate.errors";
import { NotFoundCitizenError } from "../../../citizen/domain/citizen.errors";
import { buildCandidate } from "../../../test-utils/builders/candidate-builder";
import { buildCitizen } from "../../../test-utils/builders/citizen-builder";

describe("vote candidate handler tests", () => {
  test("Should return 201 if vote is successful", async () => {
    const handler = voteForCandidate({
      candidateService: buildMockCandidateService(),
      citizenService: buildMockCitizenService(),
    });

    const mockRequest = createRequest();
    const mockResponse = createResponse();

    await handler(mockRequest, mockResponse, () => {});

    expect(mockResponse.statusCode).toBe(HTTP_CODES.CREATED);
  });

  test("Should return server error if data is wrong in database", async () => {
    const handler = voteForCandidate({
      candidateService: buildMockCandidateService({
        getAllCandidates: async () => {
          throw new ShapeCandidateError();
        },
      }),
      citizenService: buildMockCitizenService(),
    });

    const mockRequest = createRequest();
    const mockResponse = createResponse();

    await handler(mockRequest, mockResponse, () => {});

    expect(mockResponse.statusCode).toBe(HTTP_CODES.SERVER_ERROR);
  });

  test("Should return not found if candidate doesn't exist", async () => {
    const handler = voteForCandidate({
      candidateService: buildMockCandidateService({
        async registerVote() {
          throw new NotFoundCandidate();
        },
      }),
      citizenService: buildMockCitizenService(),
    });

    const mockRequest = createRequest();
    const mockResponse = createResponse();

    await handler(mockRequest, mockResponse, () => {});

    expect(mockResponse.statusCode).toBe(HTTP_CODES.NOT_FOUND);
  });

  test("Should return not found if citizen doesn't exist", async () => {
    const handler = voteForCandidate({
      candidateService: buildMockCandidateService(),
      citizenService: buildMockCitizenService({
        async findCitizenByDNI() {
          throw new NotFoundCitizenError();
        },
      }),
    });

    const mockRequest = createRequest();
    const mockResponse = createResponse();

    await handler(mockRequest, mockResponse, () => {});

    expect(mockResponse.statusCode).toBe(HTTP_CODES.NOT_FOUND);
  });

  test("Should return bad request if citizen has voted already", async () => {
    const candidates = buildCandidate.many(5);
    const citizen = buildCitizen.one();

    candidates[0].votes.push({
      citizenDNI: citizen.dni,
      createdAt: "",
    });

    const handler = voteForCandidate({
      candidateService: buildMockCandidateService({
        async getAllCandidates() {
          return candidates;
        },
      }),
      citizenService: buildMockCitizenService({
        async findCitizenByDNI() {
          return citizen;
        },
      }),
    });

    const mockRequest = createRequest();
    const mockResponse = createResponse();

    mockRequest._addBody("candidate_dni", candidates[0].dni);
    mockRequest._addBody("citizen_dni", citizen.dni);

    await handler(mockRequest, mockResponse, () => {});

    expect(mockResponse.statusCode).toBe(HTTP_CODES.BAD_REQUEST);
  });

  test("Should return server error an unknown error is thrown", async () => {
    class UnknowError extends Error {}

    const handler = voteForCandidate({
      candidateService: buildMockCandidateService({
        async getAllCandidates() {
          throw new UnknowError();
        },
      }),
      citizenService: buildMockCitizenService(),
    });

    const mockRequest = createRequest();
    const mockResponse = createResponse();

    await handler(mockRequest, mockResponse, () => {});

    expect(mockResponse.statusCode).toBe(HTTP_CODES.SERVER_ERROR);
  });
});
