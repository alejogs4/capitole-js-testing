import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "../../test-utils/renderers/render-with-providers";
import { Election } from "./election";
import { buildFakeCitizen } from "../../test-utils/builders/citizen-builder";
import { buildFakeCandidate } from "../../test-utils/builders/candidate-builder";
import userEvent from "@testing-library/user-event";

describe("election tests", () => {
  test("Should show error message if citizen is not found", async () => {
    const errorMessage = "Citizen not found";

    renderWithProviders(<Election />, {
      electionService: {
        getCitizenByDNI() {
          throw new Error(errorMessage);
        },
      },
    });

    const citizenSearchDNI = screen.getByPlaceholderText(/input your dni/i);
    fireEvent.change(citizenSearchDNI, { target: { value: "not-dni" } });

    const searchButton = screen.getByRole("button", {
      name: /search/i,
    });
    fireEvent.click(searchButton);

    const errorAlert = await screen.findByText(errorMessage);
    expect(errorAlert).toBeInTheDocument();
  });

  test("Should show candidates when search for citizen is successful and allow voting", async () => {
    const citizen = buildFakeCitizen();
    const candidates = buildFakeCandidate.many(5);

    const voteCandidateMock = jest.fn();

    renderWithProviders(<Election />, {
      electionService: {
        async getCitizenByDNI() {
          return citizen;
        },
        async getCandidates() {
          return candidates;
        },
        voteCandidate: voteCandidateMock,
      },
    });

    const citizenSearchDNI = screen.getByPlaceholderText(/input your dni/i);
    fireEvent.change(citizenSearchDNI, { target: { value: citizen.dni } });

    const searchButton = screen.getByRole("button", {
      name: /search/i,
    });
    await userEvent.click(searchButton);

    const candidatesTitles = await screen.findByText(/choose your candidate/i);
    expect(candidatesTitles).toBeInTheDocument();

    const [firstCandidate] = candidates;

    const firstCandidateOption = screen.getByLabelText(
      `${firstCandidate.name} ${firstCandidate.lastname}`
    );
    await userEvent.click(firstCandidateOption);

    const voteAlert = await screen.findByText(/citizen has already voted/i);
    expect(voteAlert).toBeInTheDocument();
  });
});
