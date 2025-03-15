"use client";
<<<<<<< HEAD

import { useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router } from "react-router-dom"; // Import BrowserRouter
import MapContainer from "./components/MapContainer";
import FilterSidebar from "./components/FilterSidebar";
import LoadingIndicator from "./components/LoadingIndicator";
import Navbar from "./components/Navbar"; // Import the Navbar component

// Create Apollo Client
=======
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import DiscussionBoardPage from "./pages/DiscussionBoard";

// Initialize Apollo Client
>>>>>>> a0ada4a (Initial commit on jaewoo branch)
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});

function App() {
<<<<<<< HEAD
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
=======
  return (
    <ApolloProvider client={client}>
      <Router>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
          {/* Navbar is displayed on all pages */}
          <Navbar />

          {/* Define routes for different pages */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/discussion" element={<DiscussionBoardPage />} />
          </Routes>
>>>>>>> a0ada4a (Initial commit on jaewoo branch)
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
