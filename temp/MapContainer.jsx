"use client"

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react"
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

function MapContainer({ activeFilters = {}, dateRange = { startDate: "", endDate: "" }, setIsLoading = () => {}, selectedDivision = "", selectedLocations = [], updateActiveFilters = () => {}, setDateRange = () => {}, setSelectedDivision = () => {}, updateSelectedLocations = () => {} }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  })

  const [map, setMap] = useState(null)
  const [mapCenter, setMapCenter] = useState(center)
  const [dataStats, setDataStats] = useState({
    fatalAccidents: 0,
    shootingIncidents: 0,
    homicides: 0,
    breakAndEnterIncidents: 0,
    pedestrianKSI: 0,
  })
  const [errors, setErrors] = useState({})
  const [promptInput, setPromptInput] = useState("")
  const [promptResult, setPromptResult] = useState("")

  // Single state for InfoWindow
  const [selectedMarker, setSelectedMarker] = useState(null)

  // Flags to track states
  const isInitialRender = useRef(true)
  const isDataFetching = useRef(false)
  const queryFunctions = useRef({})

  // Division names for reference
  const divisionNames = {
    "11": "Downtown",
    "14": "East York",
    "22": "North York",
    "31": "Etobicoke",
    "32": "York",
    "41": "Scarborough",
    "51": "Toronto East",
  }
  
  // Division coordinates
  const divisionCoordinates = {
    "11": { lat: 43.649, lng: -79.452 },
    "14": { lat: 43.655, lng: -79.419 },
    "22": { lat: 43.667, lng: -79.487 },
    "31": { lat: 43.715, lng: -79.491 },
    "32": { lat: 43.733, lng: -79.404 },
    "41": { lat: 43.725, lng: -79.265 },
    "51": { lat: 43.658, lng: -79.365 },
  }
  
  // Division bounds
  const divisionBounds = {
    "11": { north: 43.675, south: 43.625, east: -79.400, west: -79.480 },
    "14": { north: 43.685, south: 43.635, east: -79.380, west: -79.450 },
    "22": { north: 43.690, south: 43.640, east: -79.460, west: -79.520 },
    "31": { north: 43.740, south: 43.690, east: -79.460, west: -79.530 },
    "32": { north: 43.760, south: 43.700, east: -79.370, west: -79.430 },
    "41": { north: 43.750, south: 43.700, east: -79.220, west: -79.300 },
    "51": { north: 43.680, south: 43.630, east: -79.330, west: -79.400 }
  }
  
  // Division markers state
  const [divisionMarkers, setDivisionMarkers] = useState([])

  // Function to check if a point is within a bounding box
  const isPointInBounds = (lat, lng, bounds) => {
    return (
      lat <= bounds.north &&
      lat >= bounds.south &&
      lng <= bounds.east &&
      lng >= bounds.west
    )
  }

  // Prepare query variables
  const queryVariables = useMemo(() => ({
    ...(dateRange?.startDate && { startDate: dateRange.startDate }),
    ...(dateRange?.endDate && { endDate: dateRange.endDate }),
    limit: 300,
    offset: 0
  }), [dateRange])

  // Query all incident types
  // Fatal Accidents
  const {
    loading: fatalAccidentsLoading,
    data: fatalAccidentsData,
    refetch: refetchFatalAccidents,
  } = useQuery(GET_FATAL_ACCIDENTS, {
    variables: queryVariables,
    skip: !activeFilters.fatalAccidents,
    onCompleted: (data) => {
      setDataStats(prev => ({ ...prev, fatalAccidents: data?.fatalAccidents?.length || 0 }))
      setErrors(prev => ({ ...prev, fatalAccidents: null }))
      queryFunctions.current.fatalAccidents = refetchFatalAccidents
    },
    onError: (error) => {
      setErrors(prev => ({ ...prev, fatalAccidents: error.message }))
    },
    fetchPolicy: "network-only",
  })

  // Shooting Incidents
  const {
    loading: shootingIncidentsLoading,
    data: shootingIncidentsData,
    refetch: refetchShootingIncidents,
  } = useQuery(GET_SHOOTING_INCIDENTS, {
    variables: queryVariables,
    skip: !activeFilters.shootingIncidents,
    onCompleted: (data) => {
      setDataStats(prev => ({ ...prev, shootingIncidents: data?.shootingIncidents?.length || 0 }))
      setErrors(prev => ({ ...prev, shootingIncidents: null }))
      queryFunctions.current.shootingIncidents = refetchShootingIncidents
    },
    onError: (error) => {
      setErrors(prev => ({ ...prev, shootingIncidents: error.message }))
    },
    fetchPolicy: "network-only",
  })

  // Homicides
  const {
    loading: homicidesLoading,
    data: homicidesData,
    refetch: refetchHomicides,
  } = useQuery(GET_HOMICIDES, {
    variables: queryVariables,
    skip: !activeFilters.homicides,
    onCompleted: (data) => {
      setDataStats(prev => ({ ...prev, homicides: data?.homicides?.length || 0 }))
      setErrors(prev => ({ ...prev, homicides: null }))
      queryFunctions.current.homicides = refetchHomicides
    },
    onError: (error) => {
      setErrors(prev => ({ ...prev, homicides: error.message }))
    },
    fetchPolicy: "network-only",
  })

  // Break and Enter
  const {
    loading: breakAndEnterLoading,
    data: breakAndEnterData,
    refetch: refetchBreakAndEnter,
  } = useQuery(GET_BREAK_AND_ENTER_INCIDENTS, {
    variables: queryVariables,
    skip: !activeFilters.breakAndEnterIncidents,
    onCompleted: (data) => {
      setDataStats(prev => ({ ...prev, breakAndEnterIncidents: data?.breakAndEnterIncidents?.length || 0 }))
      setErrors(prev => ({ ...prev, breakAndEnterIncidents: null }))
      queryFunctions.current.breakAndEnter = refetchBreakAndEnter
    },
    onError: (error) => {
      setErrors(prev => ({ ...prev, breakAndEnterIncidents: error.message }))
    },
    fetchPolicy: "network-only",
  })

  // Pedestrian KSI
  const {
    loading: pedestrianKSILoading,
    data: pedestrianKSIData,
    refetch: refetchPedestrianKSI,
  } = useQuery(GET_PEDESTRIAN_KSI, {
    variables: queryVariables,
    skip: !activeFilters.pedestrianKSI,
    onCompleted: (data) => {
      setDataStats(prev => ({ ...prev, pedestrianKSI: data?.pedestrianKSI?.length || 0 }))
      setErrors(prev => ({ ...prev, pedestrianKSI: null }))
      queryFunctions.current.pedestrianKSI = refetchPedestrianKSI
    },
    onError: (error) => {
      setErrors(prev => ({ ...prev, pedestrianKSI: error.message }))
    },
    fetchPolicy: "network-only",
  })

  // Track loading state
  useEffect(() => {
    const isLoading = 
      fatalAccidentsLoading || 
      shootingIncidentsLoading || 
      homicidesLoading || 
      breakAndEnterLoading || 
      pedestrianKSILoading
    
    setIsLoading(isLoading)
    
    if (!isLoading) {
      isDataFetching.current = false
    }
  }, [
    fatalAccidentsLoading,
    shootingIncidentsLoading,
    homicidesLoading,
    breakAndEnterLoading,
    pedestrianKSILoading,
    setIsLoading
  ])

  // Point in selected divisions
  const isPointInSelectedDivisions = useCallback((lat, lng) => {
    if (!selectedDivision || selectedDivision === "") {
      return true
    }

    if (selectedDivision === "multiple") {
      return selectedLocations.some(divId => 
        divisionBounds[divId] && isPointInBounds(lat, lng, divisionBounds[divId])
      )
    }
    
    const bounds = divisionBounds[selectedDivision]
    return bounds && isPointInBounds(lat, lng, bounds)
  }, [selectedDivision, selectedLocations])

  // Check if a marker should be shown
  const shouldShowMarker = useCallback((lat, lng) => {
    return isPointInSelectedDivisions(lat, lng)
  }, [isPointInSelectedDivisions])
  
  // Handle marker click
  const handleMarkerClick = useCallback((incident, type) => {
    // Set marker info for InfoWindow
    setSelectedMarker({
      incident,
      type,
      position: type === 'accident' || type === 'pedestrianKSI' 
        ? { lat: incident.LATITUDE, lng: incident.LONGITUDE }
        : { lat: incident.LAT_WGS84, lng: incident.LONG_WGS84 }
    })
  }, [])
  
  // Close InfoWindow
  const closeInfoWindow = useCallback(() => {
    setSelectedMarker(null)
  }, [])
  
  // Set division markers
  useEffect(() => {
    if (selectedDivision && selectedDivision !== "") {
      if (selectedDivision === "multiple") {
        const markers = selectedLocations.map(divId => divisionCoordinates[divId])
        setDivisionMarkers(markers.filter(Boolean))
      } else {
        const marker = divisionCoordinates[selectedDivision]
        setDivisionMarkers(marker ? [marker] : [])
      }
    } else {
      setDivisionMarkers([])
    }
  }, [selectedDivision, selectedLocations])

  // Map loading handlers  
  const onLoad = useCallback(map => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Format date for display
  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return ""
    try {
      const date = new Date(dateStr)
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    } catch (e) {
      return dateStr
    }
  }

  if (!isLoaded) return <div>Loading Maps...</div>

  return (
    <div style={{ flex: 1, position: "relative" }}>
      {/* AI Command Interface */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "15px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          width: "350px",
        }}
      >
        <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
          <span>AI Map Assistant</span>
        </div>
        <div style={{ display: "flex", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="e.g., 'Show homicides in Downtown in 2022'"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "4px 0 0 4px",
              border: "1px solid #ccc",
              fontSize: "14px",
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                processPrompt(promptInput)
              }
            }}
          />
          <button
            onClick={() => processPrompt(promptInput)}
            style={{
              backgroundColor: "#4285F4",
              color: "white",
              border: "none",
              borderRadius: "0 4px 4px 0",
              padding: "0 15px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>
      </div>
      
      {/* Location filter info */}
      {selectedDivision && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "8px 12px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontSize: "14px",
            maxWidth: "300px",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Location Filter:</div>
          <div>
            {selectedDivision === "multiple" 
              ? selectedLocations.map(div => divisionNames[div]).join(", ")
              : `${divisionNames[selectedDivision] || selectedDivision}`}
          </div>
        </div>
      )}

      <GoogleMap 
        mapContainerStyle={containerStyle} 
        center={mapCenter} 
        zoom={12} 
        onLoad={onLoad} 
        onUnmount={onUnmount}
        onClick={closeInfoWindow}
      >
        {/* Division Markers */}
        {divisionMarkers.map((marker, index) => (
          <Marker
            key={`division-${index}`}
            position={marker}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/purple-pushpin.png",
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}
        
        {/* Fatal Accident Markers */}
        {activeFilters.fatalAccidents &&
          fatalAccidentsData?.fatalAccidents?.filter(accident => 
            !selectedDivision || 
            (accident.LATITUDE && accident.LONGITUDE && 
            shouldShowMarker(accident.LATITUDE, accident.LONGITUDE))
          ).map((accident) => 
            accident.LATITUDE && accident.LONGITUDE ? (
              <Marker
                key={accident._id}
                position={{
                  lat: accident.LATITUDE,
                  lng: accident.LONGITUDE,
                }}
                onClick={() => handleMarkerClick(accident, 'accident')}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null
          )}

        {/* Shooting Incident Markers */}
        {activeFilters.shootingIncidents &&
          shootingIncidentsData?.shootingIncidents?.filter(incident => 
            !selectedDivision || 
            (incident.LAT_WGS84 && incident.LONG_WGS84 && 
            shouldShowMarker(incident.LAT_WGS84, incident.LONG_WGS84))
          ).map((incident) =>
            incident.LAT_WGS84 && incident.LONG_WGS84 ? (
              <Marker
                key={incident._id}
                position={{
                  lat: incident.LAT_WGS84,
                  lng: incident.LONG_WGS84,
                }}
                onClick={() => handleMarkerClick(incident, 'shooting')}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null
          )}

        {/* Homicide Markers */}
        {activeFilters.homicides &&
          homicidesData?.homicides?.filter(homicide => 
            !selectedDivision || 
            (homicide.LAT_WGS84 && homicide.LONG_WGS84 && 
            shouldShowMarker(homicide.LAT_WGS84, homicide.LONG_WGS84))
          ).map((homicide) =>
            homicide.LAT_WGS84 && homicide.LONG_WGS84 ? (
              <Marker
                key={homicide._id}
                position={{
                  lat: homicide.LAT_WGS84,
                  lng: homicide.LONG_WGS84,
                }}
                onClick={() => handleMarkerClick(homicide, 'homicide')}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null
          )}

        {/* Break and Enter Markers */}
        {activeFilters.breakAndEnterIncidents &&
          breakAndEnterData?.breakAndEnterIncidents?.filter(incident => 
            !selectedDivision || 
            (incident.LAT_WGS84 && incident.LONG_WGS84 && 
            shouldShowMarker(incident.LAT_WGS84, incident.LONG_WGS84))
          ).map((incident) =>
            incident.LAT_WGS84 && incident.LONG_WGS84 ? (
              <Marker
                key={incident._id}
                position={{
                  lat: incident.LAT_WGS84,
                  lng: incident.LONG_WGS84,
                }}
                onClick={() => handleMarkerClick(incident, 'breakAndEnter')}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null
          )}

        {/* Pedestrian KSI Markers */}
        {activeFilters.pedestrianKSI &&
          pedestrianKSIData?.pedestrianKSI?.filter(incident => 
            !selectedDivision || 
            (incident.LATITUDE && incident.LONGITUDE && 
            shouldShowMarker(incident.LATITUDE, incident.LONGITUDE))
          ).map((incident) =>
            incident.LATITUDE && incident.LONGITUDE ? (
              <Marker
                key={incident._id}
                position={{
                  lat: incident.LATITUDE,
                  lng: incident.LONGITUDE,
                }}
                onClick={() => handleMarkerClick(incident, 'pedestrianKSI')}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null
          )}
          
        {/* Single InfoWindow */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={closeInfoWindow}
          >
            <div style={{ padding: "5px", maxWidth: "300px" }}>
              {selectedMarker.type === 'accident' && (
                <>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>Fatal Accident</h3>
                  <p style={{ margin: "4px 0" }}>Date: {selectedMarker.incident.DATE || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Location: {selectedMarker.incident.STREET1 || ''} & {selectedMarker.incident.STREET2 || ''}</p>
                  <p style={{ margin: "4px 0" }}>District: {selectedMarker.incident.DISTRICT || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Road Condition: {selectedMarker.incident.RDSFCOND || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Light Condition: {selectedMarker.incident.LIGHT || 'N/A'}</p>
                </>
              )}
              
              {selectedMarker.type === 'shooting' && (
                <>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>Shooting Incident</h3>
                  <p style={{ margin: "4px 0" }}>Event ID: {selectedMarker.incident.EVENT_UNIQUE_ID || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Date: {selectedMarker.incident.OCC_DATE || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Division: {selectedMarker.incident.DIVISION || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Death: {selectedMarker.incident.DEATH || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Injuries: {selectedMarker.incident.INJURIES || 'N/A'}</p>
                </>
              )}
              
              {selectedMarker.type === 'homicide' && (
                <>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>Homicide</h3>
                  <p style={{ margin: "4px 0" }}>Event ID: {selectedMarker.incident.EVENT_UNIQUE_ID || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Date: {selectedMarker.incident.OCC_DATE || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Division: {selectedMarker.incident.DIVISION || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Death: {selectedMarker.incident.DEATH || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Injuries: {selectedMarker.incident.INJURIES || 'N/A'}</p>
                </>
              )}
              
              {selectedMarker.type === 'breakAndEnter' && (
                <>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>Break and Enter Incident</h3>
                  <p style={{ margin: "4px 0" }}>Event ID: {selectedMarker.incident.EVENT_UNIQUE_ID || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Date: {selectedMarker.incident.OCC_DATE || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Division: {selectedMarker.incident.DIVISION || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Offense: {selectedMarker.incident.OFFENCE || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Location Type: {selectedMarker.incident.LOCATION_TYPE || 'N/A'}</p>
                </>
              )}
              
              {selectedMarker.type === 'pedestrianKSI' && (
                <>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: "bold" }}>Pedestrian KSI Incident</h3>
                  <p style={{ margin: "4px 0" }}>Date: {selectedMarker.incident.DATE || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Location: {selectedMarker.incident.STREET1 || ''} & {selectedMarker.incident.STREET2 || ''}</p>
                  <p style={{ margin: "4px 0" }}>Division: {selectedMarker.incident.DIVISION || 'N/A'}</p>
                  <p style={{ margin: "4px 0" }}>Injury: {selectedMarker.incident.INJURY || 'N/A'}</p>
                </>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  )
}

export default MapContainer 