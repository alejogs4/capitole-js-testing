import { axiosService } from "../../../config/axios";
import { ElectionResult } from "../../../types/result";

export type ResultsService = {
  getCandidatesResults(): Promise<ElectionResult>;
};

export const resultsService: ResultsService = {
  async getCandidatesResults() {
    const response = await axiosService.get("/api/v1/candidates/votes");
    return response.data.data;
  },
};
