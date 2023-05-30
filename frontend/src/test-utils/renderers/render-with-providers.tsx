import { render } from "@testing-library/react";
import { ServicesProvider } from "../../contexts";
import { ElectionService } from "../../modules/election/services/election.service";
import { ResultsService } from "../../modules/candidates-results/services/results.services";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  buildMockElectionService,
  buildMockResultsService,
} from "../builders/services-builder";

type RenderParameters = Parameters<typeof render>;

type RendererConfig = {
  electionService?: Partial<ElectionService>;
  resultsService?: Partial<ResultsService>;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithProviders(
  ui: RenderParameters[0],
  config: RenderParameters[1] & RendererConfig = {}
) {
  const { electionService = {}, resultsService = {}, ...restConfig } = config;

  return render(
    <QueryClientProvider client={queryClient}>
      <ServicesProvider
        electionService={buildMockElectionService(electionService)}
        resultsService={buildMockResultsService(resultsService)}
      >
        {ui}
      </ServicesProvider>
    </QueryClientProvider>,
    restConfig
  );
}
