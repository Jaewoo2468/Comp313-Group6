"use client";

function FilterSidebar({ activeFilters, toggleFilter }) {
  return (
    <div style={{ width: "250px", padding: "20px", borderRight: "1px solid #ccc" }}>
      <h2>Filters</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={activeFilters.fatalAccidents}
            onChange={() => toggleFilter("fatalAccidents")}
          />
          Fatal Car Accidents
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={activeFilters.shootingIncidents}
            onChange={() => toggleFilter("shootingIncidents")}
          />
          Shooting Incidents
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={activeFilters.homicides}
            onChange={() => toggleFilter("homicides")}
          />
          Homicides
        </label>
      </div>
    </div>
  );
}

export default FilterSidebar;
