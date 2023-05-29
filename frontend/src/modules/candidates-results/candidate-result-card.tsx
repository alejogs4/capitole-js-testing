import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Stack,
  StackDivider,
  Box,
  Text,
} from "@chakra-ui/react";
import { CandidateResult } from "../../types/result";

type CandidateResultCardProps = {
  result: CandidateResult;
};

export const CandidateResultCard = ({ result }: CandidateResultCardProps) => {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">{`${result.candidate.name} ${result.candidate.lastname}`}</Heading>
      </CardHeader>

      <CardBody>
        <Stack divider={<StackDivider />} spacing="4">
          <Box>
            <Heading size="xs" textTransform="uppercase">
              Votes:
            </Heading>
            <Text pt="2" fontSize="sm">
              {result.totalVotes}
            </Text>
          </Box>
          <Box>
            <Text pt="2" fontSize="sm">
              {(result.percentage * 100).toFixed(2)}%
            </Text>
          </Box>
        </Stack>
      </CardBody>
    </Card>
  );
};
