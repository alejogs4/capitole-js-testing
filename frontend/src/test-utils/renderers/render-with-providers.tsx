import { render } from "@testing-library/react";
import { ServicesProvider } from "../../contexts";
import { ElectionService } from "../../modules/election/services/election.service";
import { ResultsService } from "../../modules/candidates-results/services/results.services";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  buildMockElectionService,
  buildMockResultsService,
} from "../builders/services-builder";
import { ChakraProvider } from "@chakra-ui/react";
import { MemoryRouter } from "react-router-dom";

type RenderParameters = Parameters<typeof render>;

type RendererConfig = {
  electionService?: Partial<ElectionService>;
  resultsService?: Partial<ResultsService>;
};

const queryClient = new QueryClient({
  logger: {
    error: () => {},
    log: console.log,
    warn: console.warn,
  },
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
    <MemoryRouter>
      <ChakraProvider>
        <QueryClientProvider client={queryClient}>
          <ServicesProvider
            electionService={buildMockElectionService(electionService)}
            resultsService={buildMockResultsService(resultsService)}
          >
            {ui}
          </ServicesProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </MemoryRouter>,
    restConfig
  );
}
