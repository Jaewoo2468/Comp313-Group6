"use client"

import { useEffect, useState, useCallback } from "react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import { useQuery } from "@apollo/client"
import {
  GET_FATAL_ACCIDENTS,
  GET_SHOOTING_INCIDENTS,
  GET_HOMICIDES,
  GET_BREAK_AND_ENTER_INCIDENTS,
  GET_PEDESTRIAN_KSI,
} from "../graphql/queries"

const containerStyle = {
  width: "100%",
  height: "100vh",
}

const center = {
  lat: 43.7001,
  lng: -79.4163,
}

function MapContainer({ activeFilters, dateRange, setIsLoading }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  })

  const [map, setMap] = useState(null)
  const [selectedAccident, setSelectedAccident] = useState(null)
  const [selectedShooting, setSelectedShooting] = useState(null)
  const [selectedHomicide, setSelectedHomicide] = useState(null)
  const [selectedBreakAndEnter, setSelectedBreakAndEnter] = useState(null)
  const [selectedPedestrianKSI, setSelectedPedestrianKSI] = useState(null)
  const [mapCenter, setMapCenter] = useState(center)
  const [mapBounds, setMapBounds] = useState(null)
  const [dataStats, setDataStats] = useState({
    fatalAccidents: 0,
    shootingIncidents: 0,
    homicides: 0,
    breakAndEnterIncidents: 0,
    pedestrianKSI: 0,
  })

  // Prepare date variables for GraphQL queries
  const dateVariables = {
    startDate: dateRange.startDate || null,
    endDate: dateRange.endDate || null,
  }

  console.log("Date variables for queries:", dateVariables)

  // Query fatal accidents data with date range
  const {
    loading: fatalAccidentsLoading,
    error: fatalAccidentsError,
    data: fatalAccidentsData,
    refetch: refetchFatalAccidents,
  } = useQuery(GET_FATAL_ACCIDENTS, {
    variables: dateVariables,
    skip: !activeFilters.fatalAccidents,
    onCompleted: (data) => {
      console.log("Fatal accidents query completed:", data?.fatalAccidents?.length || 0, "results")
      setDataStats((prev) => ({ ...prev, fatalAccidents: data?.fatalAccidents?.length || 0 }))
      setIsLoading(false)
    },
    onError: (error) => {
      console.error("Fatal accidents query error:", error)
      setIsLoading(false)
    },
    fetchPolicy: "network-only", // Important: Don't use cache for date filtering
  })

  // Query shooting incidents data with date range
  const {
    loading: shootingIncidentsLoading,
    error: shootingIncidentsError,
    data: shootingIncidentsData,
    refetch: refetchShootingIncidents,
  } = useQuery(GET_SHOOTING_INCIDENTS, {
    variables: dateVariables,
    skip: !activeFilters.shootingIncidents,
    onCompleted: (data) => {
      console.log("Shooting incidents query completed:", data?.shootingIncidents?.length || 0, "results")
      setDataStats((prev) => ({ ...prev, shootingIncidents: data?.shootingIncidents?.length || 0 }))
      setIsLoading(false)
    },
    onError: (error) => {
      console.error("Shooting incidents query error:", error)
      setIsLoading(false)
    },
    fetchPolicy: "network-only",
  })

  // Query homicide data with date range
  const {
    loading: homicidesLoading,
    error: homicidesError,
    data: homicidesData,
    refetch: refetchHomicides,
  } = useQuery(GET_HOMICIDES, {
    variables: dateVariables,
    skip: !activeFilters.homicides,
    onCompleted: (data) => {
      console.log("Homicides query completed:", data?.homicides?.length || 0, "results")
      setDataStats((prev) => ({ ...prev, homicides: data?.homicides?.length || 0 }))
      setIsLoading(false)
    },
    onError: (error) => {
      console.error("Homicides query error:", error)
      setIsLoading(false)
    },
    fetchPolicy: "network-only",
  })

  // Query break and enter incidents data with date range
  const {
    loading: breakAndEnterLoading,
    error: breakAndEnterError,
    data: breakAndEnterData,
    refetch: refetchBreakAndEnter,
  } = useQuery(GET_BREAK_AND_ENTER_INCIDENTS, {
    variables: dateVariables,
    skip: !activeFilters.breakAndEnterIncidents,
    onCompleted: (data) => {
      console.log("Break and enter query completed:", data?.breakAndEnterIncidents?.length || 0, "results")
      setDataStats((prev) => ({ ...prev, breakAndEnterIncidents: data?.breakAndEnterIncidents?.length || 0 }))
      setIsLoading(false)
    },
    onError: (error) => {
      console.error("Break and enter query error:", error)
      setIsLoading(false)
    },
    fetchPolicy: "network-only",
  })

  // Query pedestrian KSI data with date range
  const {
    loading: pedestrianKSILoading,
    error: pedestrianKSIError,
    data: pedestrianKSIData,
    refetch: refetchPedestrianKSI,
  } = useQuery(GET_PEDESTRIAN_KSI, {
    variables: dateVariables,
    skip: !activeFilters.pedestrianKSI,
    onCompleted: (data) => {
      console.log("Pedestrian KSI query completed:", data?.pedestrianKSI?.length || 0, "results")
      setDataStats((prev) => ({ ...prev, pedestrianKSI: data?.pedestrianKSI?.length || 0 }))
      setIsLoading(false)
    },
    onError: (error) => {
      console.error("Pedestrian KSI query error:", error)
      setIsLoading(false)
    },
    fetchPolicy: "network-only",
  })

  // Effect to handle loading state
  useEffect(() => {
    const isLoading =
      fatalAccidentsLoading ||
      shootingIncidentsLoading ||
      homicidesLoading ||
      breakAndEnterLoading ||
      pedestrianKSILoading
    setIsLoading(isLoading)

    if (isLoading) {
      console.log("Loading data...")
    } else {
      console.log("Data loading complete")
    }
  }, [
    fatalAccidentsLoading,
    shootingIncidentsLoading,
    homicidesLoading,
    breakAndEnterLoading,
    pedestrianKSILoading,
    setIsLoading,
  ])

  // Function to refetch all active queries with date range
  const refetchAllActiveQueries = useCallback(() => {
    console.log("Refetching all active queries with date range:", dateVariables)

    if (activeFilters.fatalAccidents) {
      refetchFatalAccidents({
        variables: dateVariables,
      })
    }

    if (activeFilters.shootingIncidents) {
      refetchShootingIncidents({
        variables: dateVariables,
      })
    }

    if (activeFilters.homicides) {
      refetchHomicides({
        variables: dateVariables,
      })
    }

    if (activeFilters.breakAndEnterIncidents) {
      refetchBreakAndEnter({
        variables: dateVariables,
      })
    }

    if (activeFilters.pedestrianKSI) {
      refetchPedestrianKSI({
        variables: dateVariables,
      })
    }
  }, [
    activeFilters,
    refetchFatalAccidents,
    refetchShootingIncidents,
    refetchHomicides,
    refetchBreakAndEnter,
    refetchPedestrianKSI,
  ])

  // Effect to refetch data when date range or active filters change
  useEffect(() => {
    refetchAllActiveQueries()
  }, [dateRange, activeFilters, refetchAllActiveQueries])

  // Effect to adjust map bounds when data changes
  useEffect(() => {
    if (!map) return

    const hasData =
      fatalAccidentsData?.fatalAccidents?.length > 0 ||
      shootingIncidentsData?.shootingIncidents?.length > 0 ||
      homicidesData?.homicides?.length > 0 ||
      breakAndEnterData?.breakAndEnterIncidents?.length > 0 ||
      pedestrianKSIData?.pedestrianKSI?.length > 0

    if (hasData) {
      const bounds = new window.google.maps.LatLngBounds()
      let hasValidCoordinates = false

      // Add fatal accidents to bounds
      if (fatalAccidentsData?.fatalAccidents) {
        fatalAccidentsData.fatalAccidents.forEach((accident) => {
          if (accident.LATITUDE && accident.LONGITUDE) {
            bounds.extend({
              lat: accident.LATITUDE,
              lng: accident.LONGITUDE,
            })
            hasValidCoordinates = true
          }
        })
      }

      // Add shooting incidents to bounds
      if (shootingIncidentsData?.shootingIncidents) {
        shootingIncidentsData.shootingIncidents.forEach((incident) => {
          if (incident.LAT_WGS84 && incident.LONG_WGS84) {
            bounds.extend({
              lat: incident.LAT_WGS84,
              lng: incident.LONG_WGS84,
            })
            hasValidCoordinates = true
          }
        })
      }

      // Add homicides to bounds
      if (homicidesData?.homicides) {
        homicidesData.homicides.forEach((homicide) => {
          if (homicide.LAT_WGS84 && homicide.LONG_WGS84) {
            bounds.extend({
              lat: homicide.LAT_WGS84,
              lng: homicide.LONG_WGS84,
            })
            hasValidCoordinates = true
          }
        })
      }

      // Add break and enter incidents to bounds
      if (breakAndEnterData?.breakAndEnterIncidents) {
        breakAndEnterData.breakAndEnterIncidents.forEach((incident) => {
          if (incident.LAT_WGS84 && incident.LONG_WGS84) {
            bounds.extend({
              lat: incident.LAT_WGS84,
              lng: incident.LONG_WGS84,
            })
            hasValidCoordinates = true
          }
        })
      }

      // Add pedestrian KSI incidents to bounds
      if (pedestrianKSIData?.pedestrianKSI) {
        pedestrianKSIData.pedestrianKSI.forEach((incident) => {
          if (incident.LATITUDE && incident.LONGITUDE) {
            bounds.extend({
              lat: incident.LATITUDE,
              lng: incident.LONGITUDE,
            })
            hasValidCoordinates = true
          }
        })
      }

      // Only adjust bounds if we have valid coordinates
      if (hasValidCoordinates) {
        map.fitBounds(bounds)
        setMapBounds(bounds)

        const center = {
          lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
          lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2,
        }
        setMapCenter(center)
        console.log("Map bounds updated with new data")
      } else {
        console.log("No valid coordinates found in data")
      }
    }
  }, [map, fatalAccidentsData, shootingIncidentsData, homicidesData, breakAndEnterData, pedestrianKSIData])

  const onLoad = (map) => {
    console.log("Map loaded")
    setMap(map)
  }

  const onUnmount = () => {
    console.log("Map unmounted")
    setMap(null)
  }

  if (!isLoaded) return <div>Loading Maps...</div>

  // Format date for display (YYYY-MM-DD to MM/DD/YYYY)
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return ""

    try {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div style={{ flex: 1, position: "relative" }}>
      {/* Date filter info overlay */}
      {(dateRange.startDate || dateRange.endDate) && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "8px 12px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontSize: "14px",
            maxWidth: "300px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Date Filter Active:</div>
          <div>
            {dateRange.startDate ? formatDateForDisplay(dateRange.startDate) : "Any"} to{" "}
            {dateRange.endDate ? formatDateForDisplay(dateRange.endDate) : "Any"}
          </div>
          <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
            {Object.entries(dataStats)
              .filter(([key, count]) => activeFilters[key] && count > 0)
              .map(([key, count]) => (
                <div key={key}>
                  {key.replace(/([A-Z])/g, " $1").trim()}: {count}
                </div>
              ))}
          </div>
        </div>
      )}

      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={10} onLoad={onLoad} onUnmount={onUnmount}>
        {/* Display Fatal Accident Markers */}
        {activeFilters.fatalAccidents &&
          fatalAccidentsData?.fatalAccidents?.map((accident) =>
            accident.LATITUDE && accident.LONGITUDE ? (
              <Marker
                key={accident._id}
                position={{
                  lat: accident.LATITUDE,
                  lng: accident.LONGITUDE,
                }}
                onClick={() => setSelectedAccident(accident)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null,
          )}

        {/* Display Shooting Incident Markers */}
        {activeFilters.shootingIncidents &&
          shootingIncidentsData?.shootingIncidents?.map((incident) =>
            incident.LAT_WGS84 && incident.LONG_WGS84 ? (
              <Marker
                key={incident._id}
                position={{
                  lat: incident.LAT_WGS84,
                  lng: incident.LONG_WGS84,
                }}
                onClick={() => setSelectedShooting(incident)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null,
          )}

        {/* Display Homicide Markers */}
        {activeFilters.homicides &&
          homicidesData?.homicides?.map((homicide) =>
            homicide.LAT_WGS84 && homicide.LONG_WGS84 ? (
              <Marker
                key={homicide._id}
                position={{
                  lat: homicide.LAT_WGS84,
                  lng: homicide.LONG_WGS84,
                }}
                onClick={() => setSelectedHomicide(homicide)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null,
          )}

        {/* Display Break and Enter Incident Markers */}
        {activeFilters.breakAndEnterIncidents &&
          breakAndEnterData?.breakAndEnterIncidents?.map((incident) =>
            incident.LAT_WGS84 && incident.LONG_WGS84 ? (
              <Marker
                key={incident._id}
                position={{
                  lat: incident.LAT_WGS84,
                  lng: incident.LONG_WGS84,
                }}
                onClick={() => setSelectedBreakAndEnter(incident)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null,
          )}

        {/* Display Pedestrian KSI Incident Markers */}
        {activeFilters.pedestrianKSI &&
          pedestrianKSIData?.pedestrianKSI?.map((incident) =>
            incident.LATITUDE && incident.LONGITUDE ? (
              <Marker
                key={incident._id}
                position={{
                  lat: incident.LATITUDE,
                  lng: incident.LONGITUDE,
                }}
                onClick={() => setSelectedPedestrianKSI(incident)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null,
          )}

        {/* InfoWindow for selected Fatal Accident */}
        {selectedAccident && (
          <InfoWindow
            position={{
              lat: selectedAccident.LATITUDE,
              lng: selectedAccident.LONGITUDE,
            }}
            onCloseClick={() => setSelectedAccident(null)}
          >
            <div>
              <h3>Fatal Accident</h3>
              <p>Date: {selectedAccident.DATE}</p>
              <p>
                Location: {selectedAccident.STREET1} & {selectedAccident.STREET2}
              </p>
              <p>District: {selectedAccident.DISTRICT}</p>
              <p>Road Condition: {selectedAccident.RDSFCOND}</p>
              <p>Light Condition: {selectedAccident.LIGHT}</p>
              <p>Driver Action: {selectedAccident.DRIVACT}</p>
              <p>Vehicle Type: {selectedAccident.VEHTYPE}</p>
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for selected Shooting Incident */}
        {selectedShooting && (
          <InfoWindow
            position={{
              lat: selectedShooting.LAT_WGS84,
              lng: selectedShooting.LONG_WGS84,
            }}
            onCloseClick={() => setSelectedShooting(null)}
          >
            <div>
              <h3>Shooting Incident</h3>
              <p>Event ID: {selectedShooting.EVENT_UNIQUE_ID}</p>
              <p>Date: {selectedShooting.OCC_DATE}</p>
              <p>Division: {selectedShooting.DIVISION}</p>
              <p>Death: {selectedShooting.DEATH}</p>
              <p>Injuries: {selectedShooting.INJURIES}</p>
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for selected Homicide */}
        {selectedHomicide && (
          <InfoWindow
            position={{
              lat: selectedHomicide.LAT_WGS84,
              lng: selectedHomicide.LONG_WGS84,
            }}
            onCloseClick={() => setSelectedHomicide(null)}
          >
            <div>
              <h3>Homicide</h3>
              <p>Event ID: {selectedHomicide.EVENT_UNIQUE_ID}</p>
              <p>Date: {selectedHomicide.OCC_DATE}</p>
              <p>Division: {selectedHomicide.DIVISION}</p>
              <p>Death: {selectedHomicide.DEATH}</p>
              <p>Injuries: {selectedHomicide.INJURIES}</p>
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for selected Break and Enter Incident */}
        {selectedBreakAndEnter && (
          <InfoWindow
            position={{
              lat: selectedBreakAndEnter.LAT_WGS84,
              lng: selectedBreakAndEnter.LONG_WGS84,
            }}
            onCloseClick={() => setSelectedBreakAndEnter(null)}
          >
            <div>
              <h3>Break and Enter Incident</h3>
              <p>Event ID: {selectedBreakAndEnter.EVENT_UNIQUE_ID}</p>
              <p>Date: {selectedBreakAndEnter.OCC_DATE}</p>
              <p>Division: {selectedBreakAndEnter.DIVISION}</p>
              <p>Offense: {selectedBreakAndEnter.OFFENCE}</p>
              <p>Death: {selectedBreakAndEnter.DEATH}</p>
              <p>Injuries: {selectedBreakAndEnter.INJURIES}</p>
            </div>
          </InfoWindow>
        )}

        {/* InfoWindow for selected Pedestrian KSI Incident */}
        {selectedPedestrianKSI && (
          <InfoWindow
            position={{
              lat: selectedPedestrianKSI.LATITUDE,
              lng: selectedPedestrianKSI.LONGITUDE,
            }}
            onCloseClick={() => setSelectedPedestrianKSI(null)}
          >
            <div>
              <h3>Pedestrian KSI Incident</h3>
              <p>Date: {selectedPedestrianKSI.DATE}</p>
              <p>
                Location: {selectedPedestrianKSI.STREET1} & {selectedPedestrianKSI.STREET2}
              </p>
              <p>Division: {selectedPedestrianKSI.DIVISION}</p>
              <p>Injury: {selectedPedestrianKSI.INJURY}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}

export default MapContainer

