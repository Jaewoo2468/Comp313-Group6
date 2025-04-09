"use client";

import { useState } from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import MapContainer from "./components/MapContainer";
import FilterSidebar from "./components/FilterSidebar";
import DivisionFilter from "./components/DivisionFilter";
import LoadingIndicator from "./components/LoadingIndicator";
import Navbar from "./components/Navbar";
import DiscussionBoard from "./components/DiscussionBoard";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  useAuth,
} from "@clerk/clerk-react";

function App() {
  const [activeFilters, setActiveFilters] = useState({
    fatalAccidents: false,
    shootingIncidents: false,
    homicides: false,
    breakAndEnterIncidents: false,
    pedestrianKSI: false,
  });

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const toggleFilter = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const applyFilters = () => {
    setIsLoading(true);
  };

  // ✅ Apollo Client with Clerk token
  const { getToken } = useAuth();

  const httpLink = createHttpLink({
    uri: "http://localhost:5000/graphql",
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await getToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <Router>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            position: "relative",
          }}
        >
          <Navbar />

          <SignedIn>
            <Routes>
              <Route
                path="/"
                element={
                  <div style={{ display: "flex", flex: 1 }}>
                    <FilterSidebar
                      activeFilters={activeFilters}
                      toggleFilter={toggleFilter}
                      dateRange={dateRange}
                      setDateRange={setDateRange}
                      applyFilters={applyFilters}
                    />
                    <div style={{ flex: 1, padding: "1rem" }}>
                      <DivisionFilter />
                      <MapContainer
                        activeFilters={activeFilters}
                        dateRange={dateRange}
                        setIsLoading={setIsLoading}
                      />
                      {isLoading && <LoadingIndicator />}
                      <div style={{ marginTop: "20px" }}>
                        <SignOutButton>
                          <button
                            style={{
                              padding: "10px",
                              backgroundColor: "#e74c3c",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                            }}
                          >
                            Sign Out
                          </button>
                        </SignOutButton>
                      </div>
                    </div>
                  </div>
                }
              />

              <Route
                path="/discussion"
                element={
                  <div style={{ padding: "20px" }}>
                    <h2>Community Discussions</h2>
                    <DiscussionBoard />
                  </div>
                }
              />
            </Routes>
          </SignedIn>

          <SignedOut>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <div style={{ textAlign: "center", padding: "20px" }}>
                <h1>Welcome to the Incident Map</h1>
                <p>To view and filter incidents on the map, please sign in first.</p>
                <SignInButton mode="modal">
                  <button
                    style={{
                      padding: "15px 30px",
                      backgroundColor: "#4285F4",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </div>
            </div>
          </SignedOut>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
