"use client";

import { useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { useQuery } from "@apollo/client";
import { GET_FATAL_ACCIDENTS, GET_SHOOTING_INCIDENTS, GET_HOMICIDES, GET_BREAK_AND_ENTER_INCIDENTS, GET_PEDESTRIAN_KSI } from "../graphql/queries";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 43.7001,
  lng: -79.4163,
};

function MapContainer({ activeFilters, setIsLoading }) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [map, setMap] = useState(null);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [selectedShooting, setSelectedShooting] = useState(null);
  const [selectedHomicide, setSelectedHomicide] = useState(null);
  const [selectedBreakAndEnter, setSelectedBreakAndEnter] = useState(null);
  const [selectedPedestrianKSI, setSelectedPedestrianKSI] = useState(null);  // New state for selected Pedestrian KSI
  const [mapCenter, setMapCenter] = useState(center);
  const [mapBounds, setMapBounds] = useState(null);

  // Query fatal accidents data
  const { loading: fatalAccidentsLoading, error: fatalAccidentsError, data: fatalAccidentsData } = useQuery(GET_FATAL_ACCIDENTS, {
    skip: !activeFilters.fatalAccidents,
    onCompleted: () => setIsLoading(false),
    onError: () => setIsLoading(false),
  });

  // Query shooting incidents data
  const { loading: shootingIncidentsLoading, error: shootingIncidentsError, data: shootingIncidentsData } = useQuery(GET_SHOOTING_INCIDENTS, {
    skip: !activeFilters.shootingIncidents,
    onCompleted: () => setIsLoading(false),
    onError: () => setIsLoading(false),
  });

  // Query homicide data
  const { loading: homicidesLoading, error: homicidesError, data: homicidesData } = useQuery(GET_HOMICIDES, {
    skip: !activeFilters.homicides,
    onCompleted: () => setIsLoading(false),
    onError: () => setIsLoading(false),
  });

  // Query break and enter incidents data
  const { loading: breakAndEnterLoading, error: breakAndEnterError, data: breakAndEnterData } = useQuery(GET_BREAK_AND_ENTER_INCIDENTS, {
    skip: !activeFilters.breakAndEnterIncidents,
    onCompleted: () => setIsLoading(false),
    onError: () => setIsLoading(false),
  });

  // Query pedestrian KSI data
  const { loading: pedestrianKSILoading, error: pedestrianKSIError, data: pedestrianKSIData } = useQuery(GET_PEDESTRIAN_KSI, {
    skip: !activeFilters.pedestrianKSI,
    onCompleted: () => setIsLoading(false),
    onError: () => setIsLoading(false),
  });

  useEffect(() => {
    if (
      fatalAccidentsLoading || shootingIncidentsLoading || homicidesLoading || breakAndEnterLoading || pedestrianKSILoading
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [fatalAccidentsLoading, shootingIncidentsLoading, homicidesLoading, breakAndEnterLoading, pedestrianKSILoading, setIsLoading]);

  useEffect(() => {
    if (
      (fatalAccidentsData && fatalAccidentsData.fatalAccidents.length > 0) ||
      (shootingIncidentsData && shootingIncidentsData.shootingIncidents.length > 0) ||
      (homicidesData && homicidesData.homicides.length > 0) ||
      (breakAndEnterData && breakAndEnterData.breakAndEnterIncidents.length > 0) ||
      (pedestrianKSIData && pedestrianKSIData.pedestrianKSI.length > 0)
    ) {
      if (map) {
        const bounds = new window.google.maps.LatLngBounds();

        fatalAccidentsData?.fatalAccidents.forEach((accident) => {
          if (accident.LATITUDE && accident.LONGITUDE) {
            bounds.extend({
              lat: accident.LATITUDE,
              lng: accident.LONGITUDE,
            });
          }
        });

        shootingIncidentsData?.shootingIncidents.forEach((incident) => {
          if (incident.LAT_WGS84 && incident.LONG_WGS84) {
            bounds.extend({
              lat: incident.LAT_WGS84,
              lng: incident.LONG_WGS84,
            });
          }
        });

        homicidesData?.homicides.forEach((homicide) => {
          if (homicide.LAT_WGS84 && homicide.LONG_WGS84) {
            bounds.extend({
              lat: homicide.LAT_WGS84,
              lng: homicide.LONG_WGS84,
            });
          }
        });

        breakAndEnterData?.breakAndEnterIncidents.forEach((incident) => {
          if (incident.LAT_WGS84 && incident.LONG_WGS84) {
            bounds.extend({
              lat: incident.LAT_WGS84,
              lng: incident.LONG_WGS84,
            });
          }
        });

        pedestrianKSIData?.pedestrianKSI.forEach((incident) => {
          if (incident.LATITUDE && incident.LONGITUDE) {
            bounds.extend({
              lat: incident.LATITUDE,
              lng: incident.LONGITUDE,
            });
          }
        });

        map.fitBounds(bounds);
        setMapBounds(bounds);

        const center = {
          lat: (bounds.getNorthEast().lat() + bounds.getSouthWest().lat()) / 2,
          lng: (bounds.getNorthEast().lng() + bounds.getSouthWest().lng()) / 2,
        };
        setMapCenter(center);
      }
    }
  }, [fatalAccidentsData, shootingIncidentsData, homicidesData, breakAndEnterData, pedestrianKSIData, map]);

  const onLoad = (map) => {
    setMap(map);
  };

  const onUnmount = () => {
    setMap(null);
  };

  if (!isLoaded) return <div>Loading Maps...</div>;
  if (fatalAccidentsLoading || shootingIncidentsLoading || homicidesLoading || breakAndEnterLoading || pedestrianKSILoading) return <div>Loading data...</div>;
  if (fatalAccidentsError || shootingIncidentsError || homicidesError || breakAndEnterError || pedestrianKSIError) return <div>Error loading data: {fatalAccidentsError?.message || shootingIncidentsError?.message || homicidesError?.message || breakAndEnterError?.message || pedestrianKSIError?.message}</div>;

  return (
    <div style={{ flex: 1 }}>
      <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={10} onLoad={onLoad} onUnmount={onUnmount}>
        {/* Display Fatal Accident Markers */}
        {activeFilters.fatalAccidents &&
          fatalAccidentsData?.fatalAccidents.map((accident) =>
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
            ) : null
          )}

        {/* Display Shooting Incident Markers */}
        {activeFilters.shootingIncidents &&
          shootingIncidentsData?.shootingIncidents.map((incident) =>
            incident.LAT_WGS84 && incident.LONG_WGS84 ? (
              <Marker
                key={incident._id}
                position={{
                  lat: incident.LAT_WGS84,
                  lng: incident.LONG_WGS84,
                }}
                onClick={() => setSelectedShooting(incident)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",  // Custom color for shooting incidents
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null
          )}

        {/* Display Homicide Markers */}
        {activeFilters.homicides &&
          homicidesData?.homicides.map((homicide) =>
            homicide.LAT_WGS84 && homicide.LONG_WGS84 ? (
              <Marker
                key={homicide._id}
                position={{
                  lat: homicide.LAT_WGS84,
                  lng: homicide.LONG_WGS84,
                }}
                onClick={() => setSelectedHomicide(homicide)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",  // Custom color for homicide incidents
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null
          )}

        {/* Display Break and Enter Incident Markers */}
        {activeFilters.breakAndEnterIncidents &&
          breakAndEnterData?.breakAndEnterIncidents.map((incident) =>
            incident.LAT_WGS84 && incident.LONG_WGS84 ? (
              <Marker
                key={incident._id}
                position={{
                  lat: incident.LAT_WGS84,
                  lng: incident.LONG_WGS84,
                }}
                onClick={() => setSelectedBreakAndEnter(incident)}  // Set selected Break and Enter incident
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",  // Custom color for Break and Enter incidents
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null
          )}

        {/* Display Pedestrian KSI Incident Markers */}
        {activeFilters.pedestrianKSI &&
          pedestrianKSIData?.pedestrianKSI.map((incident) =>
            incident.LATITUDE && incident.LONGITUDE ? (
              <Marker
                key={incident._id}
                position={{
                  lat: incident.LATITUDE,
                  lng: incident.LONGITUDE,
                }}
                onClick={() => setSelectedPedestrianKSI(incident)}  // Set selected Pedestrian KSI incident
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",  // Custom color for Pedestrian KSI incidents
                  scaledSize: new window.google.maps.Size(30, 30),
                }}
              />
            ) : null
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
              <p>Location: {selectedPedestrianKSI.STREET1} & {selectedPedestrianKSI.STREET2}</p>
              <p>Division: {selectedPedestrianKSI.DIVISION}</p>
              <p>Injury: {selectedPedestrianKSI.INJURY}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default MapContainer;
