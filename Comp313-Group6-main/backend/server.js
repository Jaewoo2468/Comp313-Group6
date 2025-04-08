const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const cors = require("cors");
const mongoose = require("mongoose");
const { typeDefs } = require("./schema/typeDefs");
const { resolvers } = require("./schema/resolvers");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function startServer() {
  // ✅ Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // ✅ Start Apollo Server
  await server.start();

  // ✅ Middleware
  app.use(cors());
  app.use(express.json());

  // ✅ GraphQL endpoint with auth context
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        let user = null;

        if (token.startsWith("Bearer ")) {
          try {
            user = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
          } catch (err) {
            console.warn("Invalid token");
          }
        }

        return { user };
      },
    })
  );

  // ✅ Start Express server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 GraphQL endpoint: http://localhost:${PORT}/graphql`);
  });
}

startServer();
