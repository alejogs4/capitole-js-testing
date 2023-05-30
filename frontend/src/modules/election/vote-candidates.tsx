import React from "react";
import { Link as BrowserLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Heading,
  Link,
  Spinner,
} from "@chakra-ui/react";
import { CandidateCard } from "./candidate-card";
import { useServices } from "../../contexts";
import { Citizen } from "../../types/citizen";
import { Candidate } from "../../types/candidate";
import styles from "./election.module.scss";
import { applicationPaths } from "../../routes";

type VoteCandidatesProps = {
  citizen: Citizen;
};

export function citizenPreviouslyVoted(
  citizen: Citizen,
  candidates: Array<Candidate>
) {
  const votes = candidates.flatMap((candidate) => candidate.votes);
  return votes.some((vote) => vote.citizenDNI === citizen.dni);
}

export const VoteCandidates = ({ citizen }: VoteCandidatesProps) => {
  const [hasCitizenVote, setHasCitizenVote] = React.useState(false);
  const { electionService } = useServices();

  const { data, status } = useQuery({
    queryKey: ["candidates"],
    queryFn: () => electionService.getCandidates(),
    select: (candidates) => ({
      candidates,
      hasPreviouslyvoted: citizenPreviouslyVoted(citizen, candidates),
    }),
  });

  if (status === "loading") return <Spinner />;

  const citizenAlreadyVoted = Boolean(
    hasCitizenVote || data?.hasPreviouslyvoted
  );

  return (
    <div>
      <section className={styles["election-form__candidates-container"]}>
        <Heading marginBottom={4}>Choose your candidate</Heading>
        <ul className={styles["election-form__candidates"]}>
          {data &&
            data.candidates.map((candidate) => (
              <li key={candidate.id}>
                <CandidateCard
                  candidate={candidate}
                  citizen={citizen}
                  citizenAlreadyVoted={citizenAlreadyVoted}
                  onSuccesfulVote={() => setHasCitizenVote(true)}
                />
              </li>
            ))}
        </ul>
      </section>
      {citizenAlreadyVoted && (
        <>
          <Alert
            className={styles["election-form__vote-warn"]}
            status="warning"
          >
            <AlertIcon />
            <AlertTitle>Citizen has already vote</AlertTitle>
          </Alert>
          <footer>
            <Link
              color="yellow.600"
              as={BrowserLink}
              to={applicationPaths.results}
            >
              Results
            </Link>
          </footer>
        </>
      )}
    </div>
  );
};
