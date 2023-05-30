import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Text,
  Box,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { Candidate } from "../../types/candidate";
import styles from "./election.module.scss";
import { useMutation } from "@tanstack/react-query";
import { useServices } from "../../contexts";
import { Citizen } from "../../types/citizen";
import { isErrorWithMessage } from "./services/election.service";

type CandidateCardProps = {
  candidate: Candidate;
  citizen: Citizen;
  citizenAlreadyVoted: boolean;
  onSuccesfulVote: () => void;
};

export const CandidateCard = ({
  candidate,
  citizen,
  citizenAlreadyVoted,
  onSuccesfulVote,
}: CandidateCardProps) => {
  const { electionService } = useServices();
  const toast = useToast();

  function handleOnVoteError(error: unknown) {
    if (isErrorWithMessage(error)) {
      toast({
        colorScheme: "red",
        description: error.message,
      });
    }
  }

  function handleOnVoteSuccess() {
    toast({
      colorScheme: "green",
      description: "Thanks for your vote!",
    });
    onSuccesfulVote();
  }

  const { mutate, status } = useMutation({
    mutationKey: ["candidates:vote"],
    mutationFn: electionService.voteCandidate,
    onError: handleOnVoteError,
    onSuccess: handleOnVoteSuccess,
  });

  function handleVote() {
    if (!citizenAlreadyVoted) {
      mutate({
        candidateDNI: candidate.dni,
        citizenDNI: citizen.dni,
      });
    }
  }

  return (
    <Card
      role="button"
      className={styles["election-form__candidate"]}
      onClick={handleVote}
      aria-disabled={status === "loading" || citizenAlreadyVoted}
      aria-labelledby={candidate.dni}
      _disabled={{
        cursor: "auto",
        backgroundColor: "rgba(128, 128, 128, 0.4)",
      }}
      position="relative"
    >
      {status === "loading" && (
        <div className={styles["election-form__candidate--loader"]}>
          <Spinner />
        </div>
      )}
      <CardHeader>
        <Heading size="md">Candidate</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Name
            </Heading>
            <Text id={candidate.dni} pt="2" fontSize="sm">
              {`${candidate.name} ${candidate.lastname}`}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Age
            </Heading>
            <Text pt="2" fontSize="sm">
              {candidate.age}
            </Text>
          </Box>
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Political Party
            </Heading>
            <Text pt="2" fontSize="sm">
              {candidate.politicalParty}
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};
