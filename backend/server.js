const express = require("express")
const { ApolloServer } = require("@apollo/server")
const { expressMiddleware } = require("@apollo/server/express4")
const cors = require("cors")
const mongoose = require("mongoose")
const { typeDefs } = require("./schema/typeDefs")
const { resolvers } = require("./schema/resolvers")
require("dotenv").config()
const jwt = require("jsonwebtoken")
const homicideRoutes = require('./routes/Homicide');




const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))


// Middleware to check JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  // Extract token from Bearer "token"
  const bearerToken = token.split(" ")[1];

  // Verify the token
  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    req.user = user;
    next();
  });
};

async function startServer() {
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization || "";
      let user = null;

      // If token exists, verify and attach user data to the context
      if (token) {
        try {
          user = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        } catch (error) {
          console.error("Error verifying token:", error);
        }
      }
      return { user }; // Add user data to context if available
    },
  })

  // Start Apollo Server
  await server.start()

  // Apply middleware
  app.use(cors())
  app.use(express.json())
  
  app.use('/api/homicide', homicideRoutes);
  // Apply Apollo middleware
  app.use("/graphql", expressMiddleware(server))

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`)
  })
}

startServer()

