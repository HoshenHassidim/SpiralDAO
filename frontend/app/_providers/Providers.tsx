"use client";
import React from "react";
import WagmiProvider from "./WagmiProvider";
import { ThemeProvider } from "./ThemeContext";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
});

type ProviderType = {
  children: React.ReactNode;
};

const Providers = ({ children }: ProviderType) => {
  return (
    <ThemeProvider>
      <WagmiProvider>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
};

export default Providers;
