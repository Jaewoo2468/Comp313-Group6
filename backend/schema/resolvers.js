const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const FatalAccident = require("../models/FatalAccident");
const ShootingIncident = require("../models/ShootingIncidents");
const Homicide = require("../models/Homicide");
const BreakAndEnterIncident = require("../models/BreakAndEnter");
const PedestrianKSI = require("../models/PedestrianKSI");
<<<<<<< HEAD
=======
const Post = require("../models/Post");
>>>>>>> a0ada4a (Initial commit on jaewoo branch)

const resolvers = {
  Query: {
    // Fetch all fatal accidents
    fatalAccidents: async () => {
      try {
        return await FatalAccident.find({});
      } catch (error) {
        console.error("Error fetching fatal accidents:", error);
        throw new Error("Error fetching fatal accidents");
      }
    },

    // Fetch fatal accidents by district
    fatalAccidentsByDistrict: async (_, { district }) => {
      try {
        return await FatalAccident.find({ DISTRICT: district });
      } catch (error) {
        console.error(`Error fetching fatal accidents by district ${district}:`, error);
        throw new Error("Error fetching fatal accidents by district");
      }
    },

    // Query for all shooting incidents
    shootingIncidents: async () => {
      try {
        const incidents = await ShootingIncident.find({});
        return incidents.map(incident => ({
          ...incident.toObject(),
<<<<<<< HEAD
          DEATH: isNaN(incident.DEATH) ? String(incident.DEATH) : incident.DEATH, // Ensure DEATH is always a string
          INJURIES: isNaN(incident.INJURIES) ? String(incident.INJURIES) : incident.INJURIES, // Ensure INJURIES is always a string
=======
          DEATH: isNaN(incident.DEATH) ? String(incident.DEATH) : incident.DEATH,
          INJURIES: isNaN(incident.INJURIES) ? String(incident.INJURIES) : incident.INJURIES,
>>>>>>> a0ada4a (Initial commit on jaewoo branch)
        }));
      } catch (error) {
        console.error("Error fetching shooting incidents:", error);
        throw new Error("Error fetching shooting incidents");
      }
    },

    // Query for shooting incidents by division
    shootingIncidentsByDivision: async (_, { division }) => {
      try {
        return await ShootingIncident.find({ DIVISION: division });
      } catch (error) {
        console.error(`Error fetching shooting incidents by division ${division}:`, error);
        throw new Error("Error fetching shooting incidents by division");
      }
    },

    // Query for all homicides
    homicides: async () => {
      try {
        return await Homicide.find({});
      } catch (error) {
        console.error("Error fetching homicides:", error);
        throw new Error("Error fetching homicides");
      }
    },

    // Query for homicides by division
    homicidesByDivision: async (_, { division }) => {
      try {
        return await Homicide.find({ DIVISION: division });
      } catch (error) {
        console.error(`Error fetching homicides by division ${division}:`, error);
        throw new Error("Error fetching homicides by division");
      }
    },

    // Query for all break and enter incidents
    breakAndEnterIncidents: async () => {
      try {
        return await BreakAndEnterIncident.find({});
      } catch (error) {
        console.error("Error fetching break and enter incidents:", error);
        throw new Error("Error fetching break and enter incidents");
      }
    },

    // Query for break and enter incidents by neighborhood
    breakAndEnterIncidentsByNeighborhood: async (_, { neighborhood }) => {
      try {
        return await BreakAndEnterIncident.find({ NEIGHBOURHOOD_158: neighborhood });
      } catch (error) {
        console.error(`Error fetching break and enter incidents by neighborhood ${neighborhood}:`, error);
        throw new Error("Error fetching break and enter incidents by neighborhood");
      }
    },

    // Query for all pedestrian KSI incidents
    pedestrianKSI: async () => {
      try {
        return await PedestrianKSI.find({});
      } catch (error) {
        console.error("Error fetching pedestrian KSI incidents:", error);
        throw new Error("Error fetching pedestrian KSI incidents");
      }
    },

    // Query for pedestrian KSI incidents by neighborhood
    pedestrianKSIByNeighborhood: async (_, { neighborhood }) => {
      try {
        return await PedestrianKSI.find({ NEIGHBOURHOOD_158: neighborhood });
      } catch (error) {
        console.error(`Error fetching pedestrian KSI incidents by neighborhood ${neighborhood}:`, error);
        throw new Error("Error fetching pedestrian KSI incidents by neighborhood");
      }
    },
<<<<<<< HEAD
  },
  Mutation: {
    // Register a new user
    registerUser: async (_, { username, email, password, role }) => {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with hashed password
      const user = new User({
        username,
        email,
        password: hashedPassword,  // Store the hashed password
        role: role || 'User', // Default role is 'User'
      });

      await user.save();
      return user;  // Return the user object after it's saved
=======

    // Query for fetching all discussion board posts
    discussionPosts: async () => {
      try {
        return await Post.find({}).populate("author");
      } catch (error) {
        console.error("Error fetching discussion posts:", error);
        throw new Error("Error fetching discussion posts");
      }
    },
  },

  Mutation: {
    // Register a new user
    registerUser: async (_, { username, email, password, role }) => {
      console.log("Received register request:", { username, email, password, role }); // 
    
      if (!username || !email || !password) {
        throw new Error("All fields are required.");
      }
    
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User already exists");
      }
    
      const hashedPassword = await bcrypt.hash(password, 10);
    
      const user = new User({
        username,
        email,
        password: hashedPassword,
        role: role || "User",
      });
    
      await user.save();
      return user;
>>>>>>> a0ada4a (Initial commit on jaewoo branch)
    },

    // Login user
    loginUser: async (_, { email, password }) => {
<<<<<<< HEAD
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      // Compare the password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return { token, user };  // Return JWT token and user details
=======
      console.log("Login attempt:", { email, password }); // 
    
      if (!email || !password) {
        throw new Error("Email and password are required.");
      }
    
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error(`User with email ${email} not found.`);
      }
    
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Incorrect password.");
      }
    
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
    
      return { token, user };
    },

    // Create a new discussion post
    createPost: async (_, { content }, { user }) => {
      console.log("Create post attempt by:", user); // 
    
      if (!user) {
        throw new Error("Authentication required. Please log in.");
      }
    
      if (!content || content.trim() === "") {
        throw new Error("Post content cannot be empty.");
      }
    
      try {
        const newPost = new Post({
          author: user.id,
          content,
          createdAt: new Date(),
        });
    
        await newPost.save();
        return await newPost.populate("author");
      } catch (error) {
        console.error("Error creating post:", error);
        throw new Error("Error creating post. Please try again.");
      }
>>>>>>> a0ada4a (Initial commit on jaewoo branch)
    },
  },
};

module.exports = { resolvers };
