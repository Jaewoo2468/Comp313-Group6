import { useState } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import { BrowserRouter as Router } from "react-router-dom"
import MapContainer from "./components/MapContainer"
import FilterSidebar from "./components/FilterSidebar"
import LoadingIndicator from "./components/LoadingIndicator"
import Navbar from "./components/Navbar"
import DivisionFilter from "./components/DivisionFilter"
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/clerk-react"

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
    setIsLoading(true)
    // MapContainer will react to updated props
  }

  return (
    <ApolloProvider client={client}>
      <Router>
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", position: "relative" }}>
          <Navbar />

          {/* If user is signed in */}
          <SignedIn>
            <div style={{ display: "flex", flex: 1 }}>
              <FilterSidebar
                activeFilters={activeFilters}
                toggleFilter={toggleFilter}
                dateRange={dateRange}
                setDateRange={setDateRange}
                applyFilters={applyFilters}
              />

              <div style={{ flex: 1, padding: "1rem" }}>
                {/* 🔍 Division filter now shows inside SignedIn */}
                <DivisionFilter />

                <MapContainer
                  activeFilters={activeFilters}
                  dateRange={dateRange}
                  setIsLoading={setIsLoading}
                />

                <div style={{ marginTop: "20px" }}>
                  <SignOutButton>
                    <button style={{ padding: "10px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "4px" }}>
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              </div>
            </div>

            {isLoading && <LoadingIndicator />}
          </SignedIn>

          {/* If user is not signed in */}
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
