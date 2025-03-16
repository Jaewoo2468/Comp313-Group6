"use client"

import { useState, useEffect } from "react"

function FilterSidebar({ activeFilters, toggleFilter, dateRange, setDateRange, applyFilters }) {
  const [startDate, setStartDate] = useState(dateRange.startDate || "")
  const [endDate, setEndDate] = useState(dateRange.endDate || "")
  const [isDateFilterActive, setIsDateFilterActive] = useState(!!dateRange.startDate || !!dateRange.endDate)
  const [dateError, setDateError] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  // Update local state when dateRange prop changes
  useEffect(() => {
    setStartDate(dateRange.startDate || "")
    setEndDate(dateRange.endDate || "")
    setIsDateFilterActive(!!dateRange.startDate || !!dateRange.endDate)
  }, [dateRange])

  const validateDates = () => {
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      if (start > end) {
        setDateError("Start date cannot be after end date")
        return false
      }
    }

    setDateError("")
    return true
  }

  const handleApplyFilters = () => {
    if (!validateDates()) {
      return
    }

    setIsApplying(true)

    // Update the date range in the parent component
    setDateRange({
      startDate: startDate,
      endDate: endDate,
    })

    // Call the applyFilters function from props
    applyFilters()

    console.log("Applied date filters:", { startDate, endDate })

    // Reset applying state after a short delay
    setTimeout(() => {
      setIsApplying(false)
    }, 1000)
  }

  const handleClearDateFilter = () => {
    setStartDate("")
    setEndDate("")
    setIsDateFilterActive(false)
    setDateError("")
    setDateRange({ startDate: "", endDate: "" })
    applyFilters()

    console.log("Cleared date filters")
  }

  // Format date for display (YYYY-MM-DD to MM/DD/YYYY)
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "Any"

    try {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div style={{ width: "250px", padding: "20px", borderRight: "1px solid #ccc", overflowY: "auto" }}>
      <h2>Incidents</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px" }}>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={activeFilters.fatalAccidents}
              onChange={() => toggleFilter("fatalAccidents")}
            />
            <span>
              Fatal Car Accidents
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "red",
                  marginLeft: "8px",
                }}
              ></span>
            </span>
          </label>
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={activeFilters.shootingIncidents}
              onChange={() => toggleFilter("shootingIncidents")}
            />
            <span>
              Shooting Incidents
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "blue",
                  marginLeft: "8px",
                }}
              ></span>
            </span>
          </label>
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input type="checkbox" checked={activeFilters.homicides} onChange={() => toggleFilter("homicides")} />
            <span>
              Homicides
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "yellow",
                  marginLeft: "8px",
                }}
              ></span>
            </span>
          </label>
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={activeFilters.breakAndEnterIncidents}
              onChange={() => toggleFilter("breakAndEnterIncidents")}
            />
            <span>
              Break & Enter
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "green",
                  marginLeft: "8px",
                }}
              ></span>
            </span>
          </label>
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={activeFilters.pedestrianKSI}
              onChange={() => toggleFilter("pedestrianKSI")}
            />
            <span>
              Pedestrian KSI
              <span
                style={{
                  display: "inline-block",
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: "purple",
                  marginLeft: "8px",
                }}
              ></span>
            </span>
          </label>
        </div>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>Filter Options</h3>

        {/* Date Range Filter */}
        <div style={{ marginTop: "15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
            <label style={{ fontWeight: isDateFilterActive ? "bold" : "normal" }}>Date Range:</label>
            {isDateFilterActive && (
              <span
                style={{
                  color: "#4285F4",
                  fontSize: "12px",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={handleClearDateFilter}
              >
                Clear
              </span>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "5px" }}>
            <div>
              <label style={{ fontSize: "12px", display: "block", marginBottom: "3px" }}>Start Date:</label>
              <input
                type="date"
                style={{
                  width: "100%",
                  padding: "5px",
                  border: isDateFilterActive && startDate ? "2px solid #4285F4" : "1px solid #ddd",
                  borderRadius: "4px",
                }}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  setIsDateFilterActive(!!e.target.value || !!endDate)
                  validateDates()
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", display: "block", marginBottom: "3px" }}>End Date:</label>
              <input
                type="date"
                style={{
                  width: "100%",
                  padding: "5px",
                  border: isDateFilterActive && endDate ? "2px solid #4285F4" : "1px solid #ddd",
                  borderRadius: "4px",
                }}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setIsDateFilterActive(!!startDate || !!e.target.value)
                  validateDates()
                }}
              />
            </div>
          </div>

          {dateError && <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{dateError}</div>}
        </div>

        <button
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "15px",
            backgroundColor: isApplying ? "#2c6ecf" : "#4285F4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isApplying ? "wait" : "pointer",
            position: "relative",
            overflow: "hidden",
          }}
          onClick={handleApplyFilters}
          disabled={isApplying}
        >
          {isApplying ? "Applying..." : "Apply Filters"}
          {isApplying && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "30%",
                background: "rgba(255,255,255,0.3)",
                animation: "loading 1s infinite linear",
              }}
            ></div>
          )}
          <style>{`
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(400%); }
            }
          `}</style>
        </button>

        {isDateFilterActive && (
          <div
            style={{
              marginTop: "10px",
              padding: "8px",
              backgroundColor: "#e6f2ff",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            <strong>Active Date Filter:</strong> {formatDateForDisplay(startDate)} to {formatDateForDisplay(endDate)}
            
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterSidebar

