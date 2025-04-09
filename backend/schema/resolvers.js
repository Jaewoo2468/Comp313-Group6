const FatalAccident = require("../models/FatalAccident");
const ShootingIncident = require("../models/ShootingIncidents");
const Homicide = require("../models/Homicide");
const BreakAndEnterIncident = require("../models/BreakAndEnter");
const PedestrianKSI = require("../models/PedestrianKSI");
const User = require("../models/User");
const Discussion = require("../models/Discussion");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// --- Helper Functions ---
const formatDateForMongoDB = (dateStr) => {
  if (!dateStr) return null;

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (e) {
    console.error(`Error formatting date: ${dateStr}`, e);
    return null;
  }
};

const parseMongoDB_DateString = (dateStr) => {
  if (!dateStr) return null;

  try {
    const datePart = dateStr.split(" ")[0];

    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(datePart)) {
      const [month, day, year] = datePart.split("/").map(Number);
      return new Date(year, month - 1, day);
    } else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(datePart)) {
      const [year, month, day] = datePart.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    const fallbackDate = new Date(dateStr);
    return !isNaN(fallbackDate.getTime()) ? fallbackDate : null;
  } catch (e) {
    console.error(`Error parsing MongoDB date string: ${dateStr}`, e);
    return null;
  }
};

const isDateInRange = (dateStr, startDate, endDate) => {
  const date = parseMongoDB_DateString(dateStr);
  if (!date) return false;

  let isInRange = true;

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    isInRange = isInRange && date >= start;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    isInRange = isInRange && date <= end;
  }

  return isInRange;
};

// --- Resolvers ---
const resolvers = {
  Query: {
    // Reused logic with logging
    fatalAccidents: async (_, { startDate, endDate }) => {
      const all = await FatalAccident.find({});
      console.log(`Fetched ${all.length} fatal accidents`);
      return startDate || endDate
        ? all.filter((a) => isDateInRange(a.DATE, startDate, endDate))
        : all;
    },

    fatalAccidentsByDistrict: async (_, { district, startDate, endDate }) => {
      const all = await FatalAccident.find({ DISTRICT: district });
      console.log(`Found ${all.length} fatal accidents in district ${district}`);
      return startDate || endDate
        ? all.filter((a) => isDateInRange(a.DATE, startDate, endDate))
        : all;
    },

    shootingIncidents: async (_, { startDate, endDate }) => {
      const all = await ShootingIncident.find({});
      return startDate || endDate
        ? all.filter((i) => isDateInRange(i.OCC_DATE, startDate, endDate))
        : all;
    },

    shootingIncidentsByDivision: async (_, { division, startDate, endDate }) => {
      const all = await ShootingIncident.find({ DIVISION: division });
      return startDate || endDate
        ? all.filter((i) => isDateInRange(i.OCC_DATE, startDate, endDate))
        : all;
    },

    homicides: async (_, { startDate, endDate }) => {
      const all = await Homicide.find({});
      return startDate || endDate
        ? all.filter((h) => isDateInRange(h.OCC_DATE, startDate, endDate))
        : all;
    },

    homicidesByDivision: async (_, { division, startDate, endDate }) => {
      const all = await Homicide.find({ DIVISION: division });
      return startDate || endDate
        ? all.filter((h) => isDateInRange(h.OCC_DATE, startDate, endDate))
        : all;
    },

    breakAndEnterIncidents: async (_, { startDate, endDate }) => {
      const all = await BreakAndEnterIncident.find({});
      return startDate || endDate
        ? all.filter((i) => isDateInRange(i.OCC_DATE, startDate, endDate))
        : all;
    },

    breakAndEnterIncidentsByNeighborhood: async (_, { neighborhood, startDate, endDate }) => {
      const all = await BreakAndEnterIncident.find({ NEIGHBOURHOOD_158: neighborhood });
      return startDate || endDate
        ? all.filter((i) => isDateInRange(i.OCC_DATE, startDate, endDate))
        : all;
    },

    pedestrianKSI: async (_, { startDate, endDate }) => {
      const all = await PedestrianKSI.find({});
      return startDate || endDate
        ? all.filter((i) => isDateInRange(i.DATE, startDate, endDate))
        : all;
    },

    pedestrianKSIByNeighborhood: async (_, { neighborhood, startDate, endDate }) => {
      const all = await PedestrianKSI.find({ NEIGHBOURHOOD_158: neighborhood });
      return startDate || endDate
        ? all.filter((i) => isDateInRange(i.DATE, startDate, endDate))
        : all;
    },

    me: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findById(user.id);
    },

    getDiscussions: async () => {
      try {
        return await Discussion.find().sort({ createdAt: -1 });
      } catch (error) {
        console.error("Error fetching discussions:", error);
        throw new Error("Error fetching discussions");
      }
    },
  },

  Mutation: {
    register: async (_, { username, email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists with that email");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role: "user",
        createdAt: new Date().toISOString(),
      });

      const savedUser = await user.save();
      const token = jwt.sign(
        { id: savedUser._id, email: savedUser.email, role: savedUser.role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "1d" }
      );

      return { token, user: savedUser };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("No user found with that email");

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error("Invalid password");

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "1d" }
      );

      return { token, user };
    },

    addDiscussion: async (_, { title, message, author }) => {
      try {
        const newDiscussion = new Discussion({
          title,
          message,
          author,
          createdAt: new Date().toISOString(),
        });
        return await newDiscussion.save();
      } catch (error) {
        console.error("Error creating discussion:", error);
        throw new Error("Error creating discussion");
      }
    },

    // deleteDiscussion: async (_, { id }, context) => {
    //   try {
    //     if (!context.user) throw new Error("Not authenticated");

    //     const discussion = await Discussion.findById(id);
    //     if (!discussion) throw new Error("Discussion not found");

    //     const isAuthor =
    //       discussion.author === context.user.email ||
    //       discussion.author === context.user.username;

    //     if (!isAuthor && context.user.role !== "admin") {
    //       throw new Error("Not authorized to delete this discussion");
    //     }

    //     return await Discussion.findByIdAndDelete(id);
    //   } catch (error) {
    //     console.error("Error deleting discussion:", error.message);
    //     throw new Error("Error deleting discussion");
    //   }
    // },
    deleteDiscussion: async (_, { id }) => {
      return await Discussion.findByIdAndDelete(id);
    }

  },
};

module.exports = { resolvers };
