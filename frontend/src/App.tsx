import { Routes } from "./routes";
import styles from "./App.module.scss";

function App() {
  return (
    <>
      <main className={styles["main-app-container"]}>
        <Routes />
      </main>
    </>
  );
}

export default App;
