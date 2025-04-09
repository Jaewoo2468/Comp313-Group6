import { gql } from "@apollo/client";

// Get all fatal accidents with optional date filtering
export const GET_FATAL_ACCIDENTS = gql`
  query GetFatalAccidents($startDate: String, $endDate: String) {
    fatalAccidents(startDate: $startDate, endDate: $endDate) {
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

// Get fatal accidents by district with optional date filtering
export const GET_FATAL_ACCIDENTS_BY_DISTRICT = gql`
  query GetFatalAccidentsByDistrict($district: String!, $startDate: String, $endDate: String) {
    fatalAccidentsByDistrict(district: $district, startDate: $startDate, endDate: $endDate) {
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

// Get all shooting incidents with optional date filtering
export const GET_SHOOTING_INCIDENTS = gql`
  query GetShootingIncidents($startDate: String, $endDate: String) {
    shootingIncidents(startDate: $startDate, endDate: $endDate) {
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

// Get shooting incidents by division with optional date filtering
export const GET_SHOOTING_INCIDENTS_BY_DIVISION = gql`
  query GetShootingIncidentsByDivision($division: String!, $startDate: String, $endDate: String) {
    shootingIncidentsByDivision(division: $division, startDate: $startDate, endDate: $endDate) {
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

// Get all homicides with optional date filtering
export const GET_HOMICIDES = gql`
  query GetHomicides($startDate: String, $endDate: String) {
    homicides(startDate: $startDate, endDate: $endDate) {
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

// Get homicides by division with optional date filtering
export const GET_HOMICIDES_BY_DIVISION = gql`
  query GetHomicidesByDivision($division: String!, $startDate: String, $endDate: String) {
    homicidesByDivision(division: $division, startDate: $startDate, endDate: $endDate) {
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

// Get all break and enter incidents with optional date filtering
export const GET_BREAK_AND_ENTER_INCIDENTS = gql`
  query GetBreakAndEnterIncidents($startDate: String, $endDate: String) {
    breakAndEnterIncidents(startDate: $startDate, endDate: $endDate) {
      _id
      OBJECTID
      EVENT_UNIQUE_ID
      OCC_DATE
      OCC_YEAR
      OCC_MONTH
      OCC_DOW
      OCC_DOY
      OCC_DAY
      OCC_HOUR
      DIVISION
      LOCATION_TYPE
      UCR_CODE
      UCR_EXT
      OFFENCE
      DEATH
      INJURIES
      LAT_WGS84
      LONG_WGS84
      x
      y
    }
  }
`;

// Get break and enter incidents by neighborhood with optional date filtering
export const GET_BREAK_AND_ENTER_INCIDENTS_BY_NEIGHBORHOOD = gql`
  query GetBreakAndEnterIncidentsByNeighborhood($neighborhood: String!, $startDate: String, $endDate: String) {
    breakAndEnterIncidentsByNeighborhood(neighborhood: $neighborhood, startDate: $startDate, endDate: $endDate) {
      _id
      OBJECTID
      EVENT_UNIQUE_ID
      OCC_DATE
      OCC_YEAR
      OCC_MONTH
      OCC_DOW
      OCC_DOY
      OCC_DAY
      OCC_HOUR
      DIVISION
      LOCATION_TYPE
      UCR_CODE
      UCR_EXT
      OFFENCE
      DEATH
      INJURIES
      LAT_WGS84
      LONG_WGS84
      x
      y
    }
  }
`;

// Get all pedestrian KSI incidents with optional date filtering
export const GET_PEDESTRIAN_KSI = gql`
  query GetPedestrianKSI($startDate: String, $endDate: String) {
    pedestrianKSI(startDate: $startDate, endDate: $endDate) {
      _id
      OBJECTID
      DATE
      STREET1
      STREET2
      LATITUDE
      LONGITUDE
      VISIBILITY
      LIGHT
      IMPACTYPE
      PEDESTRIAN
      INJURY
      DIVISION
      NEIGHBOURHOOD_158
      HOOD_158
      x
      y
    }
  }
`;

// Get pedestrian KSI incidents by neighborhood with optional date filtering
export const GET_PEDESTRIAN_KSI_BY_NEIGHBORHOOD = gql`
  query GetPedestrianKSIByNeighborhood($neighborhood: String!, $startDate: String, $endDate: String) {
    pedestrianKSIByNeighborhood(neighborhood: $neighborhood, startDate: $startDate, endDate: $endDate) {
      _id
      OBJECTID
      DATE
      STREET1
      STREET2
      LATITUDE
      LONGITUDE
      VISIBILITY
      LIGHT
      IMPACTYPE
      PEDESTRIAN
      INJURY
      DIVISION
      NEIGHBOURHOOD_158
      HOOD_158
      x
      y
    }
  }
`;
