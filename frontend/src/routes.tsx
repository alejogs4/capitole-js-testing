import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Election } from "./modules/election/election";
import { CandidatesResults } from "./modules/candidates-results/candidates-results";

export const applicationPaths = {
  main: "/",
  results: "/candidates/results",
} as const;

const router = createBrowserRouter([
  {
    path: applicationPaths.main,
    Component: Election,
  },
  {
    path: applicationPaths.results,
    Component: CandidatesResults,
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
