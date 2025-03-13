const typeDefs = `#graphql
  type FatalAccident {
    _id: ID
    OBJECTID: Int
    LATITUDE: Float
    LONGITUDE: Float
    DATE: String
    TIME: Int
    STREET1: String
    STREET2: String
    DISTRICT: String
    RDSFCOND: String
    LIGHT: String
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
    VISIBILITY: String
  }

  type ShootingIncident {
    _id: ID
    EVENT_UNIQUE_ID: String
    OCC_DATE: String
    DIVISION: String
    DEATH: String
    INJURIES: String
    LAT_WGS84: Float
    LONG_WGS84: Float
  }

  type Homicide {
    _id: ID
    OBJECTID: Int
    EVENT_UNIQUE_ID: String
    OCC_DATE: String
    DIVISION: String
    DEATH: String
    INJURIES: String
    LAT_WGS84: Float
    LONG_WGS84: Float
  }

  type BreakAndEnterIncident {
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
    LOCATION_TYPE: String
    UCR_CODE: Int
    UCR_EXT: Int
    OFFENCE: String
    DEATH: String
    INJURIES: String
    LAT_WGS84: Float
    LONG_WGS84: Float
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
    _id: ID!
    username: String!  # Added username field
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

type Mutation {
  # Register a user
  registerUser(email: String!, password: String!, username: String!, role: String): User

  # Login a user
  loginUser(email: String!, password: String!): AuthPayload
}



  type Query {
    fatalAccidents: [FatalAccident]
    fatalAccidentsByDistrict(district: String): [FatalAccident]

    shootingIncidents: [ShootingIncident]
    shootingIncidentsByDivision(division: String): [ShootingIncident]

    homicides: [Homicide]
    homicidesByDivision(division: String): [Homicide]

    breakAndEnterIncidents: [BreakAndEnterIncident]
    breakAndEnterIncidentsByNeighborhood(neighborhood: String): [BreakAndEnterIncident]

    pedestrianKSI: [PedestrianKSI]
    pedestrianKSIByNeighborhood(neighborhood: String): [PedestrianKSI]
  }
`;

module.exports = { typeDefs };
