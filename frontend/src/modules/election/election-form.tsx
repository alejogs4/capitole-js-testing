import React from "react";
import {
  Heading,
  Spinner,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
} from "@chakra-ui/react";
import { isErrorWithMessage } from "./services/election.service";
import styles from "./election.module.scss";
import { useQuery } from "@tanstack/react-query";
import { Citizen } from "../../types/citizen";
import { useServices } from "../../contexts";

type ElectionFormProps = {
  onCitizenFetched: (citizen: Citizen | undefined) => void;
};

export const ElectionForm = ({ onCitizenFetched }: ElectionFormProps) => {
  const [dni, setDNI] = React.useState("");
  const { electionService } = useServices();

  const { status, refetch, isFetching, error } = useQuery({
    queryKey: ["citizens:dni"],
    queryFn: () => electionService.getCitizenByDNI(dni),
    onError: () => onCitizenFetched(undefined),
    onSuccess: (data) => onCitizenFetched(data),
    enabled: false,
    retry: false,
  });

  function fetchCitizenDNI(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    refetch();
  }

  return (
    <form onSubmit={fetchCitizenDNI}>
      <Heading marginBottom="16">Welcome to these elections!</Heading>
      <div className={styles["election-form__citizen-input"]}>
        {isFetching ? (
          <Spinner />
        ) : (
          <>
            <Input
              placeholder="Input your DNI"
              value={dni}
              onChange={(e) => setDNI(e.target.value)}
              required
              marginBottom={4}
            />
            <Button
              type="submit"
              marginBottom={4}
              color="black"
              backgroundColor="yellow.400"
              width="28"
            >
              Search
            </Button>
          </>
        )}
        {status === "error" && isErrorWithMessage(error) && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle>Error fetching citizen DNI</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </form>
  );
};
