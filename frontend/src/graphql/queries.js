import { gql } from "@apollo/client";

// Get all fatal accidents
export const GET_FATAL_ACCIDENTS = gql`
  query GetFatalAccidents {
    fatalAccidents {
      _id
      OBJECTID
      LATITUDE
      LONGITUDE
      DATE
      TIME
      STREET1
      STREET2
      DISTRICT
      RDSFCOND
      LIGHT
      ACCLASS
      IMPACTYPE
      INVTYPE
      INVAGE
      INJURY
      INITDIR
      VEHTYPE
      MANOEUVER
      DRIVACT
      DRIVCOND
      VISIBILITY
    }
  }
`;

// Get fatal accidents by district
export const GET_FATAL_ACCIDENTS_BY_DISTRICT = gql`
  query GetFatalAccidentsByDistrict($district: String!) {
    fatalAccidentsByDistrict(district: $district) {
      _id
      OBJECTID
      LATITUDE
      LONGITUDE
      DATE
      TIME
      STREET1
      STREET2
      DISTRICT
      RDSFCOND
      LIGHT
      ACCLASS
      IMPACTYPE
      INVTYPE
      INVAGE
      INJURY
      INITDIR
      VEHTYPE
      MANOEUVER
      DRIVACT
      DRIVCOND
      VISIBILITY
    }
  }
`;

// Get all shooting incidents
export const GET_SHOOTING_INCIDENTS = gql`
  query GetShootingIncidents {
    shootingIncidents {
      _id
      EVENT_UNIQUE_ID
      OCC_DATE
      DIVISION
      DEATH
      INJURIES
      LAT_WGS84
      LONG_WGS84
    }
  }
`;

// Get shooting incidents by division
export const GET_SHOOTING_INCIDENTS_BY_DIVISION = gql`
  query GetShootingIncidentsByDivision($division: String!) {
    shootingIncidentsByDivision(division: $division) {
      _id
      EVENT_UNIQUE_ID
      OCC_DATE
      DIVISION
      DEATH
      INJURIES
      LAT_WGS84
      LONG_WGS84
    }
  }
`;

export const GET_HOMICIDES = gql`
  query GetHomicides {
    homicides {
      _id
      OBJECTID
      EVENT_UNIQUE_ID
      OCC_DATE
      DIVISION
      DEATH
      INJURIES
      LAT_WGS84
      LONG_WGS84
    }
  }
`;


// Get homicides by division
export const GET_HOMICIDES_BY_DIVISION = gql`
  query GetHomicidesByDivision($division: String!) {
    homicidesByDivision(division: $division) {
      _id
      OBJECTID
      EVENT_UNIQUE_ID
      OCC_DATE
      DIVISION
      DEATH
      INJURIES
      LAT_WGS84
      LONG_WGS84
    }
  }
`;
