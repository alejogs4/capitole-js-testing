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
import { CandidateService } from "../../domain/candidate.service";
import { CitizenService } from "../../../citizen/domain/citizen.service";

type TestCase = {
  name: string;
  mocks?: {
    candidateService?: Partial<CandidateService>;
    citizenService?: Partial<CitizenService>;
  };
  expectedStatusCode: number;
  body?: Record<string, string>;
};

function getVotedCandidate() {
  const candidates = buildCandidate.many(5);
  const citizen = buildCitizen.one();

  candidates[0].votes.push({
    citizenDNI: citizen.dni,
    createdAt: "",
  });
  return { candidates, citizen };
}

class UnknowError extends Error {}

describe("vote candidate handler tests", () => {
  const { candidates, citizen } = getVotedCandidate();
  const testCases: Array<TestCase> = [
    {
      name: "Should return 201 if vote is successful",
      expectedStatusCode: HTTP_CODES.CREATED,
    },
    {
      name: "Should return server error if data is wrong in database",
      mocks: {
        candidateService: {
          getAllCandidates: async () => {
            throw new ShapeCandidateError();
          },
        },
      },
      expectedStatusCode: HTTP_CODES.SERVER_ERROR,
    },
    {
      name: "Should return not found if candidate doesn't exist",
      mocks: {
        candidateService: {
          async registerVote() {
            throw new NotFoundCandidate();
          },
        },
      },
      expectedStatusCode: HTTP_CODES.NOT_FOUND,
    },
    {
      name: "Should return not found if citizen doesn't exist",
      mocks: {
        citizenService: {
          async findCitizenByDNI() {
            throw new NotFoundCitizenError();
          },
        },
      },
      expectedStatusCode: HTTP_CODES.NOT_FOUND,
    },
    {
      name: "Should return bad request if citizen has voted already",
      mocks: {
        candidateService: {
          async getAllCandidates() {
            return candidates;
          },
        },
        citizenService: {
          async findCitizenByDNI() {
            return citizen;
          },
        },
      },
      expectedStatusCode: HTTP_CODES.BAD_REQUEST,
      body: {
        candidate_dni: candidates[0].dni,
        citizen_dni: citizen.dni,
      },
    },
    {
      name: "Should return server error an unknown error is thrown",
      mocks: {
        candidateService: {
          async getAllCandidates() {
            throw new UnknowError();
          },
        },
      },
      expectedStatusCode: HTTP_CODES.SERVER_ERROR,
    },
  ];

  testCases.forEach((testCase) => {
    test(testCase.name, async () => {
      const handler = voteForCandidate({
        candidateService: buildMockCandidateService(
          testCase.mocks?.candidateService
        ),
        citizenService: buildMockCitizenService(testCase.mocks?.citizenService),
      });

      const mockRequest = createRequest();
      const mockResponse = createResponse();

      Object.entries(testCase.body || {}).forEach(([key, value]) => {
        mockRequest._addBody(key, value);
      });

      await handler(mockRequest, mockResponse, () => {});

      expect(mockResponse.statusCode).toBe(testCase.expectedStatusCode);
    });
  });
});
