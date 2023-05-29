import React from 'react';
import "./index.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ServicesProvider } from "./contexts";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ServicesProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ServicesProvider>
    </QueryClientProvider>
  </React.StrictMode>
);



