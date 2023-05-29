import { isAxiosError } from "axios";
import { axiosService } from "../../../config/axios";
import { Citizen } from "../../../types/citizen";
import { Candidate } from "../../../types/candidate";

type VoteCandidateDependencies = {
  citizenDNI: string;
  candidateDNI: string;
};

export type ElectionService = {
  getCitizenByDNI(dni: string): Promise<Citizen>;
  getCandidates(): Promise<Array<Candidate>>;
  voteCandidate(voteInfo: VoteCandidateDependencies): Promise<void>;
};

export const electionService: ElectionService = {
  async getCitizenByDNI(dni: string) {
    try {
      const { data } = await axiosService.get(`/api/v1/citizens/${dni}`);
      return data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message);
      }
      throw error;
    }
  },
  async getCandidates() {
    try {
      const { data } = await axiosService.get("/api/v1/candidates");
      return data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message);
      }
      throw error;
    }
  },
  async voteCandidate(voteInfo) {
    try {
      await axiosService.post("/api/v1/candidates/vote", {
        citizen_dni: voteInfo.citizenDNI,
        candidate_dni: voteInfo.candidateDNI,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message);
      }
      throw error;
    }
  },
};

export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return typeof error === "object" && error !== null && "message" in error;
}
