const FatalAccident = require("../models/FatalAccident")
const ShootingIncident = require("../models/ShootingIncidents")
const Homicide = require("../models/Homicide")
const BreakAndEnterIncident = require("../models/BreakAndEnter")
const PedestrianKSI = require("../models/PedestrianKSI")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Helper function to create date filter for MongoDB date strings like "3/6/2006 5:00:00 AM"
const createDateFilter = (dateField, startDate, endDate) => {
  const filter = {}

  if (startDate || endDate) {
    filter[dateField] = {}

    if (startDate) {
      // Convert YYYY-MM-DD to Date object
      const startDateObj = new Date(startDate)

      // Format month and day for regex pattern
      const startMonth = startDateObj.getMonth() + 1 // getMonth() is 0-indexed
      const startDay = startDateObj.getDate()
      const startYear = startDateObj.getFullYear()

      // Create regex pattern for start date: M/D/YYYY
      // This will match dates like "3/6/2006 5:00:00 AM"
      const startRegex = new RegExp(`^${startMonth}\\/${startDay}\\/${startYear}`)

      // Use $regex for string comparison since dates are stored as strings
      filter[dateField]["$gte"] = startRegex

      console.log(`Start date filter: ${startMonth}/${startDay}/${startYear}, regex: ${startRegex}`)
    }

    if (endDate) {
      // Convert YYYY-MM-DD to Date object and add one day
      const endDateObj = new Date(endDate)
      endDateObj.setDate(endDateObj.getDate() + 1)

      // Format month and day for regex pattern
      const endMonth = endDateObj.getMonth() + 1
      const endDay = endDateObj.getDate()
      const endYear = endDateObj.getFullYear()

      // Create regex pattern for end date: M/D/YYYY
      const endRegex = new RegExp(`^${endMonth}\\/${endDay}\\/${endYear}`)

      // Use $regex for string comparison
      filter[dateField]["$lt"] = endRegex

      console.log(`End date filter: ${endMonth}/${endDay}/${endYear}, regex: ${endRegex}`)
    }
  }

  console.log(`Date filter created for ${dateField}:`, filter)
  return filter
}

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

const resolvers = {
  Query: {
    // Fatal Accidents
    fatalAccidents: async (_, { startDate, endDate }) => {
      try {

        // Build a filter for string-based date comparison
        const filter = {}

        if (startDate || endDate) {
          // For string comparison with MongoDB date format
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.DATE = filter.DATE || {}
              // Use $regex to match the beginning of the date string
              filter.DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }

          if (endDate) {
            // Add one day to include the end date
            const endDateObj = new Date(endDate)
            endDateObj.setDate(endDateObj.getDate() + 1)

            const formattedEndDate = formatDateForMongoDB(endDateObj.toISOString().split("T")[0])
            if (formattedEndDate) {
              // We need to use $lt for the end date
              // This is complex with string comparison, so we'll use a different approach
              // We'll get all records and filter in memory
              console.log(`Will filter end date in memory: ${formattedEndDate}`)
            }
          }
        }


        // Get all accidents matching the filter
        let accidents = await FatalAccident.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          // Set to end of day
          endDateObj.setHours(23, 59, 59, 999)

          accidents = accidents.filter((accident) => {
            try {
              // Parse the accident date string
              const accidentDateParts = accident.DATE.split(" ")[0].split("/")
              const month = Number.parseInt(accidentDateParts[0])
              const day = Number.parseInt(accidentDateParts[1])
              const year = Number.parseInt(accidentDateParts[2])

              const accidentDate = new Date(year, month - 1, day)
              return accidentDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing accident date: ${accident.DATE}`, e)
              return true // Include if we can't parse
            }
          })
        }

        return accidents
      } catch (error) {
        console.error("Error fetching fatal accidents:", error)
        throw new Error(`Error fetching fatal accidents: ${error.message}`)
      }
    },
    fatalAccidentsByDistrict: async (_, { district, startDate, endDate }) => {
      try {
        const filter = { DISTRICT: district }

        if (startDate || endDate) {
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.DATE = filter.DATE || {}
              filter.DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }
        }

        let accidents = await FatalAccident.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          // Set to end of day
          endDateObj.setHours(23, 59, 59, 999)

          accidents = accidents.filter((accident) => {
            try {
              const accidentDateParts = accident.DATE.split(" ")[0].split("/")
              const month = Number.parseInt(accidentDateParts[0])
              const day = Number.parseInt(accidentDateParts[1])
              const year = Number.parseInt(accidentDateParts[2])

              const accidentDate = new Date(year, month - 1, day)
              return accidentDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing accident date: ${accident.DATE}`, e)
              return true
            }
          })
        }

        console.log(`Fetched ${accidents.length} fatal accidents in district: ${district} with date filter`)
        return accidents
      } catch (error) {
        console.error(`Error fetching fatal accidents by district ${district}:`, error)
        throw new Error(`Error fetching fatal accidents by district: ${error.message}`)
      }
    },

    // Shooting Incidents
    shootingIncidents: async (_, { startDate, endDate }) => {
      try {
        const filter = {}

        if (startDate || endDate) {
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.OCC_DATE = filter.OCC_DATE || {}
              filter.OCC_DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }
        }

        let incidents = await ShootingIncident.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          endDateObj.setHours(23, 59, 59, 999)

          incidents = incidents.filter((incident) => {
            try {
              const incidentDateParts = incident.OCC_DATE.split(" ")[0].split("/")
              const month = Number.parseInt(incidentDateParts[0])
              const day = Number.parseInt(incidentDateParts[1])
              const year = Number.parseInt(incidentDateParts[2])

              const incidentDate = new Date(year, month - 1, day)
              return incidentDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing incident date: ${incident.OCC_DATE}`, e)
              return true
            }
          })
        }

        console.log(`Fetched ${incidents.length} shooting incidents with date filter`)
        return incidents
      } catch (error) {
        console.error("Error fetching shooting incidents:", error)
        throw new Error(`Error fetching shooting incidents: ${error.message}`)
      }
    },
    shootingIncidentsByDivision: async (_, { division, startDate, endDate }) => {
      try {
        const filter = { DIVISION: division }

        if (startDate || endDate) {
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.OCC_DATE = filter.OCC_DATE || {}
              filter.OCC_DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }
        }

        let incidents = await ShootingIncident.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          endDateObj.setHours(23, 59, 59, 999)

          incidents = incidents.filter((incident) => {
            try {
              const incidentDateParts = incident.OCC_DATE.split(" ")[0].split("/")
              const month = Number.parseInt(incidentDateParts[0])
              const day = Number.parseInt(incidentDateParts[1])
              const year = Number.parseInt(incidentDateParts[2])

              const incidentDate = new Date(year, month - 1, day)
              return incidentDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing incident date: ${incident.OCC_DATE}`, e)
              return true
            }
          })
        }

        console.log(`Fetched ${incidents.length} shooting incidents in division: ${division} with date filter`)
        return incidents
      } catch (error) {
        console.error(`Error fetching shooting incidents by division ${division}:`, error)
        throw new Error(`Error fetching shooting incidents by division: ${error.message}`)
      }
    },

    // Homicides
    homicides: async (_, { startDate, endDate }) => {
      try {
        const filter = {}

        if (startDate || endDate) {
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.OCC_DATE = filter.OCC_DATE || {}
              filter.OCC_DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }
        }

        let homicides = await Homicide.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          endDateObj.setHours(23, 59, 59, 999)

          homicides = homicides.filter((homicide) => {
            try {
              const homicideDateParts = homicide.OCC_DATE.split(" ")[0].split("/")
              const month = Number.parseInt(homicideDateParts[0])
              const day = Number.parseInt(homicideDateParts[1])
              const year = Number.parseInt(homicideDateParts[2])

              const homicideDate = new Date(year, month - 1, day)
              return homicideDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing homicide date: ${homicide.OCC_DATE}`, e)
              return true
            }
          })
        }

        console.log(`Fetched ${homicides.length} homicides with date filter`)
        return homicides
      } catch (error) {
        console.error("Error fetching homicides:", error)
        throw new Error(`Error fetching homicides: ${error.message}`)
      }
    },
    homicidesByDivision: async (_, { division, startDate, endDate }) => {
      try {
        const filter = { DIVISION: division }

        if (startDate || endDate) {
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.OCC_DATE = filter.OCC_DATE || {}
              filter.OCC_DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }
        }

        let homicides = await Homicide.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          endDateObj.setHours(23, 59, 59, 999)

          homicides = homicides.filter((homicide) => {
            try {
              const homicideDateParts = homicide.OCC_DATE.split(" ")[0].split("/")
              const month = Number.parseInt(homicideDateParts[0])
              const day = Number.parseInt(homicideDateParts[1])
              const year = Number.parseInt(homicideDateParts[2])

              const homicideDate = new Date(year, month - 1, day)
              return homicideDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing homicide date: ${homicide.OCC_DATE}`, e)
              return true
            }
          })
        }

        console.log(`Fetched ${homicides.length} homicides in division: ${division} with date filter`)
        return homicides
      } catch (error) {
        console.error(`Error fetching homicides by division ${division}:`, error)
        throw new Error(`Error fetching homicides by division: ${error.message}`)
      }
    },

    // Break and Enter Incidents
    breakAndEnterIncidents: async (_, { startDate, endDate }) => {
      try {
        const filter = {}

        if (startDate || endDate) {
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.OCC_DATE = filter.OCC_DATE || {}
              filter.OCC_DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }
        }

        let incidents = await BreakAndEnterIncident.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          endDateObj.setHours(23, 59, 59, 999)

          incidents = incidents.filter((incident) => {
            try {
              const incidentDateParts = incident.OCC_DATE.split(" ")[0].split("/")
              const month = Number.parseInt(incidentDateParts[0])
              const day = Number.parseInt(incidentDateParts[1])
              const year = Number.parseInt(incidentDateParts[2])

              const incidentDate = new Date(year, month - 1, day)
              return incidentDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing incident date: ${incident.OCC_DATE}`, e)
              return true
            }
          })
        }

        console.log(`Fetched ${incidents.length} break and enter incidents with date filter`)
        return incidents
      } catch (error) {
        console.error("Error fetching break and enter incidents:", error)
        throw new Error(`Error fetching break and enter incidents: ${error.message}`)
      }
    },
    breakAndEnterIncidentsByNeighborhood: async (_, { neighborhood, startDate, endDate }) => {
      try {
        const filter = { NEIGHBOURHOOD_158: neighborhood }

        if (startDate || endDate) {
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.OCC_DATE = filter.OCC_DATE || {}
              filter.OCC_DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }
        }

        let incidents = await BreakAndEnterIncident.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          endDateObj.setHours(23, 59, 59, 999)

          incidents = incidents.filter((incident) => {
            try {
              const incidentDateParts = incident.OCC_DATE.split(" ")[0].split("/")
              const month = Number.parseInt(incidentDateParts[0])
              const day = Number.parseInt(incidentDateParts[1])
              const year = Number.parseInt(incidentDateParts[2])

              const incidentDate = new Date(year, month - 1, day)
              return incidentDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing incident date: ${incident.OCC_DATE}`, e)
              return true
            }
          })
        }

        console.log(
          `Fetched ${incidents.length} break and enter incidents in neighborhood: ${neighborhood} with date filter`,
        )
        return incidents
      } catch (error) {
        console.error(`Error fetching break and enter incidents by neighborhood ${neighborhood}:`, error)
        throw new Error(`Error fetching break and enter incidents by neighborhood: ${error.message}`)
      }
    },

    // Pedestrian KSI
    pedestrianKSI: async (_, { startDate, endDate }) => {
      try {
        const filter = {}

        if (startDate || endDate) {
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.DATE = filter.DATE || {}
              filter.DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }
        }

        let incidents = await PedestrianKSI.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          endDateObj.setHours(23, 59, 59, 999)

          incidents = incidents.filter((incident) => {
            try {
              const incidentDateParts = incident.DATE.split(" ")[0].split("/")
              const month = Number.parseInt(incidentDateParts[0])
              const day = Number.parseInt(incidentDateParts[1])
              const year = Number.parseInt(incidentDateParts[2])

              const incidentDate = new Date(year, month - 1, day)
              return incidentDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing incident date: ${incident.DATE}`, e)
              return true
            }
          })
        }

        console.log(`Fetched ${incidents.length} pedestrian KSI incidents with date filter`)
        return incidents
      } catch (error) {
        console.error("Error fetching pedestrian KSI incidents:", error)
        throw new Error(`Error fetching pedestrian KSI incidents: ${error.message}`)
      }
    },
    pedestrianKSIByNeighborhood: async (_, { neighborhood, startDate, endDate }) => {
      try {
        const filter = { NEIGHBOURHOOD_158: neighborhood }

        if (startDate || endDate) {
          if (startDate) {
            const formattedStartDate = formatDateForMongoDB(startDate)
            if (formattedStartDate) {
              filter.DATE = filter.DATE || {}
              filter.DATE.$regex = new RegExp(
                `^(${formattedStartDate}|([1-9]\\d?/[1-9]\\d?/${new Date(startDate).getFullYear()}))`,
              )
            }
          }
        }

        let incidents = await PedestrianKSI.find(filter)

        // If we have an end date, filter in memory
        if (endDate) {
          const endDateObj = new Date(endDate)
          endDateObj.setHours(23, 59, 59, 999)

          incidents = incidents.filter((incident) => {
            try {
              const incidentDateParts = incident.DATE.split(" ")[0].split("/")
              const month = Number.parseInt(incidentDateParts[0])
              const day = Number.parseInt(incidentDateParts[1])
              const year = Number.parseInt(incidentDateParts[2])

              const incidentDate = new Date(year, month - 1, day)
              return incidentDate <= endDateObj
            } catch (e) {
              console.error(`Error parsing incident date: ${incident.DATE}`, e)
              return true
            }
          })
        }

        console.log(
          `Fetched ${incidents.length} pedestrian KSI incidents in neighborhood: ${neighborhood} with date filter`,
        )
        return incidents
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
          { expiresIn: "1d" },
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

