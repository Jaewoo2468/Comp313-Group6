"use client";

import { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import MapContainer from "./components/MapContainer";
import FilterSidebar from "./components/FilterSidebar";
import LoadingIndicator from "./components/LoadingIndicator";
import Navbar from "./components/Navbar"; // Import the Navbar component

// Create Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});

function App() {
  const [activeFilters, setActiveFilters] = useState({
    fatalAccidents: false,
    shootingIncidents: false,
    homicides: false,
    breakAndEnterIncidents: false,
    pedestrianKSI: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleFilter = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  return (
    <ApolloProvider client={client}>
      <Router> {/* Wrap your app in Router */}
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
          {/* Add Navbar component at the top */}
          <Navbar />
          
          <div style={{ display: "flex", flex: 1 }}>
            <FilterSidebar activeFilters={activeFilters} toggleFilter={toggleFilter} />
            <MapContainer activeFilters={activeFilters} setIsLoading={setIsLoading} />
          </div>

          {/* Loading indicator will show when isLoading is true */}
          {isLoading && <LoadingIndicator />}
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
