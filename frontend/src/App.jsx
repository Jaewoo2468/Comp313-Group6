"use client"

import { useState } from "react"
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client"
import MapContainer from "./components/MapContainer"
import FilterSidebar from "./components/FilterSidebar"
import LoadingIndicator from "./components/LoadingIndicator"

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
  const [isLoading, setIsLoading] = useState(false)

  const toggleFilter = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }))
  }

  return (
    <ApolloProvider client={client}>
      <div style={{ display: "flex", height: "100vh", position: "relative" }}>
        <FilterSidebar activeFilters={activeFilters} toggleFilter={toggleFilter} />
        <MapContainer activeFilters={activeFilters} setIsLoading={setIsLoading} />
        {isLoading && <LoadingIndicator />}
      </div>
    </ApolloProvider>
  )
}

export default App

