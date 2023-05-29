import React from "react";
import { Citizen } from "../../types/citizen";
import { ElectionForm } from "./election-form";
import { VoteCandidates } from "./vote-candidates";
import styles from "./election.module.scss";
import classNames from "classnames";

export const Election = () => {
  const [citizen, setCitizen] = React.useState<Citizen | undefined>(undefined);

  return (
    <div className={styles["election-form"]}>
      <div
        className={classNames(
          styles["election-form__container"],
          styles["election-form__form"]
        )}
      >
        <ElectionForm onCitizenFetched={setCitizen} />
      </div>
      <div className={styles["election-form__container"]}>
        {citizen && <VoteCandidates citizen={citizen} />}
      </div>
    </div>
  );
};
