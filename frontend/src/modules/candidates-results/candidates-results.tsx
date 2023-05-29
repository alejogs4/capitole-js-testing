import { Heading } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useServices } from "../../contexts";
import { CandidateResultCard } from "./candidate-result-card";
import styles from "./candidate-results.module.scss";

export const CandidatesResults = () => {
  const { resultsService } = useServices();

  const { status, data: candidatesResults } = useQuery({
    queryKey: ["candidates:results"],
    queryFn: resultsService.getCandidatesResults,
  });

  if (status === "loading") {
    return <Heading marginBottom={4}>Loading...</Heading>;
  }

  return (
    <div className={styles["candidate-result"]}>
      <Heading marginBottom={4}>Results</Heading>
      <ul className={styles["candidate-result__list"]}>
        {candidatesResults &&
          candidatesResults.results.map((result) => (
            <li key={result.candidate.dni}>
              <CandidateResultCard result={result} />
            </li>
          ))}
      </ul>
    </div>
  );
};
