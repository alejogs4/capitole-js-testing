import { screen, waitFor } from "@testing-library/react";
import { buildFakeCandidate } from "../../test-utils/builders/candidate-builder";
import { buildFakeCitizen } from "../../test-utils/builders/citizen-builder";
import { renderWithProviders } from "../../test-utils/renderers/render-with-providers";
import { CandidateCard } from "./candidate-card";
import userEvent from "@testing-library/user-event";

describe("candidate card tests", () => {
  test("Should render candidate name", () => {
    const candidate = buildFakeCandidate();
    const citizen = buildFakeCitizen();

    renderWithProviders(
      <CandidateCard
        candidate={candidate}
        citizen={citizen}
        citizenAlreadyVoted={false}
        onSuccesfulVote={jest.fn()}
      />
    );

    const candidateName = screen.getByText(
      `${candidate.name} ${candidate.lastname}`
    );

    expect(candidateName).toBeInTheDocument();
  });

  test("Should be disabled if citizen has voted", () => {
    const candidate = buildFakeCandidate();
    const citizen = buildFakeCitizen();

    renderWithProviders(
      <CandidateCard
        candidate={candidate}
        citizen={citizen}
        citizenAlreadyVoted
        onSuccesfulVote={jest.fn()}
      />
    );

    const candidateCard = screen.getByLabelText(
      `${candidate.name} ${candidate.lastname}`
    );

    expect(candidateCard).toHaveAttribute("aria-disabled", "true");
  });

  test("Should be enabled if citizen has not voted", () => {
    const candidate = buildFakeCandidate();
    const citizen = buildFakeCitizen();

    renderWithProviders(
      <CandidateCard
        candidate={candidate}
        citizen={citizen}
        citizenAlreadyVoted={false}
        onSuccesfulVote={jest.fn()}
      />
    );

    const candidateCard = screen.getByLabelText(
      `${candidate.name} ${candidate.lastname}`
    );

    expect(candidateCard).toHaveAttribute("aria-disabled", "false");
  });

  test("Should call onSuccesfulVote when citizen has not voted and click on card", async () => {
    const candidate = buildFakeCandidate();
    const citizen = buildFakeCitizen();

    const onSuccesfulVote = jest.fn();
    const voteCandidateMock = jest.fn();

    renderWithProviders(
      <CandidateCard
        candidate={candidate}
        citizen={citizen}
        citizenAlreadyVoted={false}
        onSuccesfulVote={onSuccesfulVote}
      />,
      {
        electionService: {
          voteCandidate: voteCandidateMock,
        },
      }
    );

    const candidateCard = screen.getByLabelText(
      `${candidate.name} ${candidate.lastname}`
    );

    await userEvent.click(candidateCard);

    await waitFor(() => expect(voteCandidateMock).toHaveBeenCalled());
    await waitFor(() => expect(onSuccesfulVote).toHaveBeenCalled());
  });

  test("Should not call onSuccesfulVote when citizen has voted before and click on card", async () => {
    const candidate = buildFakeCandidate();
    const citizen = buildFakeCitizen();

    const onSuccesfulVote = jest.fn();
    const voteCandidateMock = jest.fn();

    renderWithProviders(
      <CandidateCard
        candidate={candidate}
        citizen={citizen}
        citizenAlreadyVoted={false}
        onSuccesfulVote={onSuccesfulVote}
      />,
      {
        electionService: {
          voteCandidate: voteCandidateMock,
        },
      }
    );

    const candidateCard = screen.getByLabelText(
      `${candidate.name} ${candidate.lastname}`
    );

    await userEvent.click(candidateCard);

    await waitFor(() => expect(voteCandidateMock).not.toHaveBeenCalled());
    await waitFor(() => expect(onSuccesfulVote).not.toHaveBeenCalled());
  });
});
