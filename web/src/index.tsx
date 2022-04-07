import React from "react";

import { createRoot } from "react-dom/client";

import App from "./App";

import {
    ApolloClient,
    ApolloLink,
    createHttpLink,
    InMemoryCache,
    ApolloProvider
} from "@apollo/client";

const httpLink = createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include"
});

const client = new ApolloClient({
    link: ApolloLink.from([httpLink]),
    cache: new InMemoryCache()
});

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <App />
        </ApolloProvider>
    </React.StrictMode>
);
