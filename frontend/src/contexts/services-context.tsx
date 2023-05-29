import React from "react";
import {
  ElectionService,
  electionService as appElectionService,
} from "../modules/election/services/election.service";
import {
  ResultsService,
  resultsService as appResultsService,
} from "../modules/candidates-results/services/results.services";

type Services = {
  electionService: ElectionService;
  resultsService: ResultsService;
};

const ServicesContext = React.createContext({} as Services);

type ServicesProviderProps = {
  electionService?: ElectionService;
  resultsService?: ResultsService;
  children: React.ReactNode;
};

export const ServicesProvider = ({
  electionService = appElectionService,
  resultsService = appResultsService,
  children,
}: ServicesProviderProps) => {
  return (
    <ServicesContext.Provider
      value={{
        electionService,
        resultsService,
      }}
    >
      {children}
    </ServicesContext.Provider>
  );
};

export function useServices() {
  return React.useContext(ServicesContext);
}
