const typeDefs = `#graphql
  type FatalAccident {
    _id: ID
    OBJECTID: Int
    INDEX: Int
    ACCNUM: Int
    DATE: String
    TIME: Int
    STREET1: String
    STREET2: String
    ROAD_CLASS: String
    DISTRICT: String
    LATITUDE: Float
    LONGITUDE: Float
    TRAFFCTL: String
    VISIBILITY: String
    LIGHT: String
    RDSFCOND: String
    ACCLASS: String
    IMPACTYPE: String
    INVTYPE: String
    INVAGE: String
    INJURY: String
    INITDIR: String
    VEHTYPE: String
    MANOEUVER: String
    DRIVACT: String
    DRIVCOND: String
    AUTOMOBILE: String
    HOOD_158: Int
    NEIGHBOURHOOD_158: String
    HOOD_140: Int
    NEIGHBOURHOOD_140: String
    DIVISION: String
    x: Float
    y: Float
  }

  type ShootingIncident {
    _id: ID
    OBJECTID: Int
    EVENT_UNIQUE_ID: String
    OCC_DATE: String
    OCC_YEAR: Int
    OCC_MONTH: String
    OCC_DOW: String
    OCC_DOY: Int
    OCC_DAY: Int
    OCC_HOUR: Int
    OCC_TIME_RANGE: String
    DIVISION: String
    DEATH: String
    INJURIES: String
    HOOD_158: String
    NEIGHBOURHOOD_158: String
    HOOD_140: String
    NEIGHBOURHOOD_140: String
    LONG_WGS84: Float
    LAT_WGS84: Float
    x: Float
    y: Float
  }

  type Homicide {
    _id: ID
    OBJECTID: Int
    EVENT_UNIQUE_ID: String
    OCC_DATE: String
    OCC_YEAR: Int
    OCC_MONTH: String
    OCC_DOW: String
    OCC_DOY: Int
    OCC_DAY: Int
    OCC_HOUR: Int
    DIVISION: String
    DEATH: String
    INJURIES: String
    LAT_WGS84: Float
    LONG_WGS84: Float
    x: Float
    y: Float
  }

  type BreakAndEnterIncident {
    _id: ID
    OBJECTID: Int
    EVENT_UNIQUE_ID: String
    REPORT_DATE: String
    OCC_DATE: String
    OCC_YEAR: Int
    OCC_MONTH: String
    OCC_DAY: Int
    OCC_DOW: String
    OCC_HOUR: Int
    DIVISION: String
    LOCATION_TYPE: String
    PREMISES_TYPE: String
    UCR_CODE: Int
    UCR_EXT: Int
    OFFENCE: String
    MCI_CATEGORY: String
    HOOD_158: Int
    NEIGHBOURHOOD_158: String
    HOOD_140: Int
    NEIGHBOURHOOD_140: String
    LONG_WGS84: Float
    LAT_WGS84: Float
    x: Float
    y: Float
  }

  type PedestrianKSI {
    _id: ID
    OBJECTID: Int
    DATE: String
    STREET1: String
    STREET2: String
    LATITUDE: Float
    LONGITUDE: Float
    VISIBILITY: String
    LIGHT: String
    IMPACTYPE: String
    PEDESTRIAN: String
    INJURY: String
    DIVISION: String
    NEIGHBOURHOOD_158: String
    HOOD_158: Int
    x: Float
    y: Float
  }

  type User {
    _id: ID
    username: String
    email: String
    role: String
    createdAt: String
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    # Fatal Accidents
    fatalAccidents(startDate: String, endDate: String): [FatalAccident]
    fatalAccidentsByDistrict(district: String!, startDate: String, endDate: String): [FatalAccident]
    
    # Shooting Incidents
    shootingIncidents(startDate: String, endDate: String): [ShootingIncident]
    shootingIncidentsByDivision(division: String!, startDate: String, endDate: String): [ShootingIncident]
    
    # Homicides
    homicides(startDate: String, endDate: String): [Homicide]
    homicidesByDivision(division: String!, startDate: String, endDate: String): [Homicide]
    
    # Break and Enter Incidents
    breakAndEnterIncidents(startDate: String, endDate: String): [BreakAndEnterIncident]
    breakAndEnterIncidentsByNeighborhood(neighborhood: String!, startDate: String, endDate: String): [BreakAndEnterIncident]
    
    # Pedestrian KSI
    pedestrianKSI(startDate: String, endDate: String): [PedestrianKSI]
    pedestrianKSIByNeighborhood(neighborhood: String!, startDate: String, endDate: String): [PedestrianKSI]
    
    # User
    me: User
  }

  type Mutation {
    # User Authentication
    register(username: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
  }
`

module.exports = { typeDefs }

