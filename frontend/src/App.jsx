"use client";

import { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapContainer from "./components/MapContainer";
import FilterSidebar from "./components/FilterSidebar";
import LoadingIndicator from "./components/LoadingIndicator";
import Navbar from "./components/Navbar";

// Create HTTP link
const httpLink = createHttpLink({
  uri: "http://localhost:5000/graphql",
});

// Create auth link
const authLink = setContext((_, { headers }) => {
  // Get the token from localStorage
  const token = localStorage.getItem("token");
  
  // Return the headers to the context
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Create Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function HomePage({ activeFilters, toggleFilter, dateRange, setDateRange, applyFilters, isLoading, setIsLoading }) {
  return (
    <div style={{ display: "flex", flex: 1 }}>
      <FilterSidebar 
        activeFilters={activeFilters} 
        toggleFilter={toggleFilter} 
        dateRange={dateRange}
        setDateRange={setDateRange}
        applyFilters={applyFilters}
      />
      <MapContainer 
        activeFilters={activeFilters} 
        dateRange={dateRange}
        setIsLoading={setIsLoading} 
      />
      {isLoading && <LoadingIndicator />}
    </div>
  );
}

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
    endDate: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleFilter = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const applyFilters = () => {
    // This function will trigger a refetch of the data with the new filters
    // We'll set isLoading to true to show the loading indicator
    setIsLoading(true);
    
    // The actual refetch will happen in the MapContainer component
    // when it detects changes to the dateRange prop
  };

  return (
    <ApolloProvider client={client}>
      <Router>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
          <Navbar />
          
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  activeFilters={activeFilters} 
                  toggleFilter={toggleFilter}
                  dateRange={dateRange}
                  setDateRange={setDateRange}
                  applyFilters={applyFilters}
                  isLoading={isLoading} 
                  setIsLoading={setIsLoading} 
                />
              } 
            />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
