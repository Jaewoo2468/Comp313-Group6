"use client"

import { useState } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { BrowserRouter as Router } from "react-router-dom"
import MapContainer from "./components/MapContainer"
import FilterSidebar from "./components/FilterSidebar"
import LoadingIndicator from "./components/LoadingIndicator"
import Navbar from "./components/Navbar"
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react"

// Create Apollo Client
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
})

function App() {
  const [activeFilters, setActiveFilters] = useState({
    fatalAccidents: false,
    shootingIncidents: false,
    homicides: false,
    breakAndEnterIncidents: false,
    pedestrianKSI: false,
  })
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const toggleFilter = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  const applyFilters = () => {
    // This function will trigger a refetch of the data with the new filters
    // We'll set isLoading to true to show the loading indicator
    setIsLoading(true)

    // The actual refetch will happen in the MapContainer component
    // when it detects changes to the dateRange prop
  }

  return (
    <ApolloProvider client={client}>
      <Router>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
          <Navbar />

          <SignedIn>
            <div style={{ display: "flex", flex: 1 }}>
              <FilterSidebar
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
                applyFilters={applyFilters}
              />
              <MapContainer activeFilters={activeFilters} dateRange={dateRange} setIsLoading={setIsLoading} />
            </div>
            {isLoading && <LoadingIndicator />}
          </SignedIn>

          <SignedOut>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
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
  )
}

export default App

