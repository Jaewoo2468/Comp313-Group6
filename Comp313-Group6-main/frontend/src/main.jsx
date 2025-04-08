import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient"; // ⬅️ You'll create this file (if you haven’t yet)

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ClerkProvider>
  </React.StrictMode>
);
