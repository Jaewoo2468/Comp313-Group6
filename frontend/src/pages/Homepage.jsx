import React, { useState } from "react";
import FilterSidebar from "../components/FilterSidebar";
import MapContainer from "../components/MapContainer";
import LoadingIndicator from "../components/LoadingIndicator";

// HomePage component - Handles filters and map display
function HomePage() {
  const [activeFilters, setActiveFilters] = useState({
    fatalAccidents: false,
    shootingIncidents: false,
    homicides: false,
    breakAndEnterIncidents: false,
    pedestrianKSI: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Toggle filter state
  const toggleFilter = (filterName) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  return (
    <div style={{ display: "flex", flex: 1 }}>
      {/* Sidebar with filters */}
      <FilterSidebar activeFilters={activeFilters} toggleFilter={toggleFilter} />

      {/* Map component */}
      <MapContainer activeFilters={activeFilters} setIsLoading={setIsLoading} />

      {/* Loading indicator when data is fetching */}
      {isLoading && <LoadingIndicator />}
    </div>
  );
}

export default HomePage;
