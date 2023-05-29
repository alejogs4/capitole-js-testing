import { Candidate, hasCitizenVoted } from "./candidate";

describe("candidate tests", () => {
  describe("hasCitizenVoted", () => {
    test("Should return true if citizen has voted for a candidate", () => {
      // Arrange
      const CITIZEN_ID = "citizen-2";
      const candidates: Array<Candidate> = [
        {
          id: "id-1",
          dni: "dni-1",
          name: "Jhoan",
          lastname: "Cuartas",
          age: 32,
          politicalParty: "PSOE",
          votes: [
            {
              citizenDNI: "citizen-1",
              createdAt: "",
            },
          ],
        },
        {
          id: "id-2",
          dni: "dni-2",
          name: "Bill",
          lastname: "Barrera",
          age: 32,
          politicalParty: "Podemos",
          votes: [
            {
              citizenDNI: CITIZEN_ID,
              createdAt: "",
            },
          ],
        },
      ];

      // Act
      const hasVoted = hasCitizenVoted(candidates, CITIZEN_ID);

      // Assert
      expect(hasVoted).toBe(true);
    });

    test("Should return false if citizen has not voted for a candidate", () => {
      // Arrange
      const CITIZEN_ID = "citizen-3";
      const candidates: Array<Candidate> = [
        {
          id: "id-1",
          dni: "dni-1",
          name: "Jhoan",
          lastname: "Cuartas",
          age: 32,
          politicalParty: "PSOE",
          votes: [
            {
              citizenDNI: "citizen-1",
              createdAt: "",
            },
          ],
        },
        {
          id: "id-2",
          dni: "dni-2",
          name: "Bill",
          lastname: "Barrera",
          age: 32,
          politicalParty: "Podemos",
          votes: [
            {
              citizenDNI: "citizen-2",
              createdAt: "",
            },
          ],
        },
      ];

      // Act
      const hasVoted = hasCitizenVoted(candidates, CITIZEN_ID);

      // Assert
      expect(hasVoted).toBe(false);
    });
  });
});
