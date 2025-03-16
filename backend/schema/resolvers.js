const FatalAccident = require("../models/FatalAccident")
const ShootingIncident = require("../models/ShootingIncidents")
const Homicide = require("../models/Homicide")
const BreakAndEnterIncident = require("../models/BreakAndEnter")
const PedestrianKSI = require("../models/PedestrianKSI")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Helper function to convert YYYY-MM-DD to MongoDB date format (M/D/YYYY)
const formatDateForMongoDB = (dateStr) => {
  if (!dateStr) return null

  try {
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) {
      console.error(`Invalid date: ${dateStr}`)
      return null
    }

    const month = date.getMonth() + 1 // getMonth() is 0-indexed
    const day = date.getDate()
    const year = date.getFullYear()

    return `${month}/${day}/${year}`
  } catch (e) {
    console.error(`Error formatting date: ${dateStr}`, e)
    return null
  }
}

// Helper function to parse MongoDB date string to Date object
const parseMongoDB_DateString = (dateStr) => {
  if (!dateStr) return null

  try {
    // Handle different date formats that might be in the database
    // Extract just the date part (before any time or AM/PM)
    const datePart = dateStr.split(" ")[0]

    // Check if the date is in MM/DD/YYYY format
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(datePart)) {
      const [month, day, year] = datePart.split("/").map((num) => Number.parseInt(num, 10))
      // Create a new Date object (months are 0-indexed in JavaScript)
      return new Date(year, month - 1, day)
    }
    // Check if the date is in YYYY-MM-DD format
    else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(datePart)) {
      const [year, month, day] = datePart.split("-").map((num) => Number.parseInt(num, 10))
      return new Date(year, month - 1, day)
    }

    // If we can't parse it with our custom logic, try the native Date parser
    const fallbackDate = new Date(dateStr)
    if (!isNaN(fallbackDate.getTime())) {
      return fallbackDate
    }

    console.error(`Unparseable date format: ${dateStr}`)
    return null
  } catch (e) {
    console.error(`Error parsing MongoDB date string: ${dateStr}`, e)
    return null
  }
}

// Helper function to check if a date is within a range
const isDateInRange = (dateStr, startDate, endDate) => {
  if (!dateStr) {
    console.log(`Skipping null date string in isDateInRange`)
    return false
  }

  try {
    const date = parseMongoDB_DateString(dateStr)
    if (!date) {
      console.log(`Could not parse date: ${dateStr}`)
      return false
    }

    let isInRange = true

    if (startDate) {
      const start = new Date(startDate)
      // Set start to beginning of day
      start.setHours(0, 0, 0, 0)
      isInRange = isInRange && date >= start
    }

    if (endDate) {
      const end = new Date(endDate)
      // Set end to end of day
      end.setHours(23, 59, 59, 999)
      isInRange = isInRange && date <= end
    }

    return isInRange
  } catch (e) {
    console.error(`Error checking date range for: ${dateStr}`, e)
    return false
  }
}

const resolvers = {
  Query: {
    // Fatal Accidents
    fatalAccidents: async (_, { startDate, endDate }) => {
      try {
        console.log(`Raw date inputs - startDate: ${startDate}, endDate: ${endDate}`)

        // Get all accidents first
        const allAccidents = await FatalAccident.find({})
        console.log(`Total fatal accidents in database: ${allAccidents.length}`)

        // Filter by date range if provided
        if (startDate || endDate) {
          const filteredAccidents = allAccidents.filter((accident) => isDateInRange(accident.DATE, startDate, endDate))

          console.log(`Filtered to ${filteredAccidents.length} fatal accidents within date range`)
          return filteredAccidents
        }

        return allAccidents
      } catch (error) {
        console.error("Error fetching fatal accidents:", error)
        throw new Error(`Error fetching fatal accidents: ${error.message}`)
      }
    },
    fatalAccidentsByDistrict: async (_, { district, startDate, endDate }) => {
      try {
        // Get accidents by district
        const accidentsByDistrict = await FatalAccident.find({ DISTRICT: district })
        console.log(`Total fatal accidents in district ${district}: ${accidentsByDistrict.length}`)

        // Filter by date range if provided
        if (startDate || endDate) {
          const filteredAccidents = accidentsByDistrict.filter((accident) =>
            isDateInRange(accident.DATE, startDate, endDate),
          )

          console.log(
            `Filtered to ${filteredAccidents.length} fatal accidents in district ${district} within date range`,
          )
          return filteredAccidents
        }

        return accidentsByDistrict
      } catch (error) {
        console.error(`Error fetching fatal accidents by district ${district}:`, error)
        throw new Error(`Error fetching fatal accidents by district: ${error.message}`)
      }
    },

    // Shooting Incidents
    shootingIncidents: async (_, { startDate, endDate }) => {
      try {
        // Get all incidents
        const allIncidents = await ShootingIncident.find({})
        console.log(`Total shooting incidents in database: ${allIncidents.length}`)

        // Filter by date range if provided
        if (startDate || endDate) {
          const filteredIncidents = allIncidents.filter((incident) =>
            isDateInRange(incident.OCC_DATE, startDate, endDate),
          )

          console.log(`Filtered to ${filteredIncidents.length} shooting incidents within date range`)
          return filteredIncidents
        }

        return allIncidents
      } catch (error) {
        console.error("Error fetching shooting incidents:", error)
        throw new Error(`Error fetching shooting incidents: ${error.message}`)
      }
    },
    shootingIncidentsByDivision: async (_, { division, startDate, endDate }) => {
      try {
        // Get incidents by division
        const incidentsByDivision = await ShootingIncident.find({ DIVISION: division })
        console.log(`Total shooting incidents in division ${division}: ${incidentsByDivision.length}`)

        // Filter by date range if provided
        if (startDate || endDate) {
          const filteredIncidents = incidentsByDivision.filter((incident) =>
            isDateInRange(incident.OCC_DATE, startDate, endDate),
          )

          console.log(
            `Filtered to ${filteredIncidents.length} shooting incidents in division ${division} within date range`,
          )
          return filteredIncidents
        }

        return incidentsByDivision
      } catch (error) {
        console.error(`Error fetching shooting incidents by division ${division}:`, error)
        throw new Error(`Error fetching shooting incidents by division: ${error.message}`)
      }
    },

    // Homicides
    homicides: async (_, { startDate, endDate }) => {
      try {
        // Get all homicides
        const allHomicides = await Homicide.find({})
        console.log(`Total homicides in database: ${allHomicides.length}`)

        // Filter by date range if provided
        if (startDate || endDate) {
          const filteredHomicides = allHomicides.filter((homicide) =>
            isDateInRange(homicide.OCC_DATE, startDate, endDate),
          )

          console.log(`Filtered to ${filteredHomicides.length} homicides within date range`)
          return filteredHomicides
        }

        return allHomicides
      } catch (error) {
        console.error("Error fetching homicides:", error)
        throw new Error(`Error fetching homicides: ${error.message}`)
      }
    },
    homicidesByDivision: async (_, { division, startDate, endDate }) => {
      try {
        // Get homicides by division
        const homicidesByDivision = await Homicide.find({ DIVISION: division })
        console.log(`Total homicides in division ${division}: ${homicidesByDivision.length}`)

        // Filter by date range if provided
        if (startDate || endDate) {
          const filteredHomicides = homicidesByDivision.filter((homicide) =>
            isDateInRange(homicide.OCC_DATE, startDate, endDate),
          )

          console.log(`Filtered to ${filteredHomicides.length} homicides in division ${division} within date range`)
          return filteredHomicides
        }

        return homicidesByDivision
      } catch (error) {
        console.error(`Error fetching homicides by division ${division}:`, error)
        throw new Error(`Error fetching homicides by division: ${error.message}`)
      }
    },

    // Break and Enter Incidents
    breakAndEnterIncidents: async (_, { startDate, endDate }) => {
      try {
        console.log(`Fetching break and enter incidents with date range: ${startDate} to ${endDate}`)

        // Get all incidents without any filter first
        const allIncidents = await BreakAndEnterIncident.find({})
        console.log(`Total break and enter incidents in database: ${allIncidents.length}`)

        // Log some sample dates to help debug
        if (allIncidents.length > 0) {
          const sampleSize = Math.min(5, allIncidents.length)
          console.log(`Sample OCC_DATE values from database:`)
          for (let i = 0; i < sampleSize; i++) {
            console.log(`  Sample ${i + 1}: ${allIncidents[i].OCC_DATE} (type: ${typeof allIncidents[i].OCC_DATE})`)
          }
        }

        // Filter by date range if provided
        if (startDate || endDate) {
          console.log(`Filtering by date range: ${startDate} to ${endDate}`)

          // Use a more defensive filtering approach
          const filteredIncidents = allIncidents.filter((incident) => {
            // Skip incidents with missing or invalid OCC_DATE
            if (!incident || !incident.OCC_DATE) {
              return false
            }

            // Try to determine if the date is in range
            const inRange = isDateInRange(incident.OCC_DATE, startDate, endDate)
            return inRange
          })

          console.log(`Filtered to ${filteredIncidents.length} break and enter incidents within date range`)
          return filteredIncidents
        }

        return allIncidents
      } catch (error) {
        console.error("Error fetching break and enter incidents:", error)
        throw new Error(`Error fetching break and enter incidents: ${error.message}`)
      }
    },
    breakAndEnterIncidentsByNeighborhood: async (_, { neighborhood, startDate, endDate }) => {
      try {
        // Get incidents by neighborhood
        const incidentsByNeighborhood = await BreakAndEnterIncident.find({ NEIGHBOURHOOD_158: neighborhood })
        console.log(
          `Total break and enter incidents in neighborhood ${neighborhood}: ${incidentsByNeighborhood.length}`,
        )

        // Filter by date range if provided
        if (startDate || endDate) {
          const filteredIncidents = incidentsByNeighborhood.filter((incident) => {
            // Check if OCC_DATE exists and is a string
            if (!incident.OCC_DATE || typeof incident.OCC_DATE !== "string") {
              return false
            }

            return isDateInRange(incident.OCC_DATE, startDate, endDate)
          })

          console.log(
            `Filtered to ${filteredIncidents.length} break and enter incidents in neighborhood ${neighborhood} within date range`,
          )
          return filteredIncidents
        }

        return incidentsByNeighborhood
      } catch (error) {
        console.error(`Error fetching break and enter incidents by neighborhood ${neighborhood}:`, error)
        throw new Error(`Error fetching break and enter incidents by neighborhood: ${error.message}`)
      }
    },

    // Pedestrian KSI
    pedestrianKSI: async (_, { startDate, endDate }) => {
      try {
        // Get all incidents
        const allIncidents = await PedestrianKSI.find({})
        console.log(`Total pedestrian KSI incidents in database: ${allIncidents.length}`)

        // Filter by date range if provided
        if (startDate || endDate) {
          const filteredIncidents = allIncidents.filter((incident) => isDateInRange(incident.DATE, startDate, endDate))

          console.log(`Filtered to ${filteredIncidents.length} pedestrian KSI incidents within date range`)
          return filteredIncidents
        }

        return allIncidents
      } catch (error) {
        console.error("Error fetching pedestrian KSI incidents:", error)
        throw new Error(`Error fetching pedestrian KSI incidents: ${error.message}`)
      }
    },
    pedestrianKSIByNeighborhood: async (_, { neighborhood, startDate, endDate }) => {
      try {
        // Get incidents by neighborhood
        const incidentsByNeighborhood = await PedestrianKSI.find({ NEIGHBOURHOOD_158: neighborhood })
        console.log(`Total pedestrian KSI incidents in neighborhood ${neighborhood}: ${incidentsByNeighborhood.length}`)

        // Filter by date range if provided
        if (startDate || endDate) {
          const filteredIncidents = incidentsByNeighborhood.filter((incident) =>
            isDateInRange(incident.DATE, startDate, endDate),
          )

          console.log(
            `Filtered to ${filteredIncidents.length} pedestrian KSI incidents in neighborhood ${neighborhood} within date range`,
          )
          return filteredIncidents
        }

        return incidentsByNeighborhood
      } catch (error) {
        console.error(`Error fetching pedestrian KSI incidents by neighborhood ${neighborhood}:`, error)
        throw new Error(`Error fetching pedestrian KSI incidents by neighborhood: ${error.message}`)
      }
    },

    // User
    me: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Not authenticated")
      }
      return await User.findById(user.id)
    },
  },

  Mutation: {
    // User Authentication
    register: async (_, { username, email, password }) => {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
          throw new Error("User already exists with that email")
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create new user
        const user = new User({
          username,
          email,
          password: hashedPassword,
          role: "user", // Default role
          createdAt: new Date().toISOString(),
        })

        // Save user to database
        const savedUser = await user.save()

        // Generate JWT token
        const token = jwt.sign(
          { id: savedUser._id, email: savedUser.email, role: savedUser.role },
          process.env.JWT_SECRET || "your-secret-key",
          { expiresIn: "1d" },
        )

        return {
          token,
          user: savedUser,
        }
      } catch (error) {
        console.error("Error registering user:", error)
        throw new Error(`Error registering user: ${error.message}`)
      }
    },
    // Update the login resolver to include the user ID in the token
    login: async (_, { email, password }) => {
      try {
        // Find user by email
        const user = await User.findOne({ email })
        if (!user) {
          throw new Error("No user found with that email")
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
          throw new Error("Invalid password")
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user._id, email: user.email, role: user.role },
          process.env.JWT_SECRET || "your-secret-key",
          { expiresIn: "7d" }, // Extended token expiration to 7 days
        )

        return {
          token,
          user,
        }
      } catch (error) {
        console.error("Error logging in:", error)
        throw new Error(`Error logging in: ${error.message}`)
      }
    },
  },
}

module.exports = { resolvers }

