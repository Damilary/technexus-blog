// backend/src/index.ts
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

// Startup Environment Variable Checks
const REQUIRED_ENV_VARS = ["DATABASE_URL", "JWT_SECRET"];
for (const varName of REQUIRED_ENV_VARS) {
  if (!Object.prototype.hasOwnProperty.call(process.env, varName)) {
    console.error(`FATAL ERROR: Environment variable ${varName} is not set.`);
    process.exit(1); // Exit if a required variable is missing
  }
}

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/typeDefs";
import { resolvers, userResolvers } from "./graphql/resolvers";
import { getUserFromToken } from "./middleware/auth";
import { PrismaClient } from "./generated/prisma";
import { Context } from "./graphql/types";

const JWT_SECRET = process.env.JWT_SECRET ?? (() => { throw new Error("JWT_SECRET is not defined"); })();
const prisma = new PrismaClient();

// Merge resolvers
const combinedResolvers = {
  Query: resolvers.Query,
  Mutation: {
    ...resolvers.Mutation,
    ...userResolvers.Mutation,
  },
};

// Initialize Express app
const app = express();
const PORT = process.env.PORT ?? 4000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Connect to MongoDB (if needed)
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/technexus-blog";

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Initialize Apollo Server
async function startServer() {
  // JWT_SECRET is already defined and checked at the top level
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers: combinedResolvers,
    formatError: (formattedError, error) => {
      // Log the original error for internal debugging
      console.error("GraphQL Error (Original): ", error); // Log original error
      console.error("GraphQL Error (Formatted): ", formattedError); // Log formatted error

      // In a production environment, hide detailed errors from the client
      if (process.env.NODE_ENV === "production") {
        // Return a generic message
        // Optionally, include error extensions like 'code' if they are safe
        return {
          message: "An unexpected error occurred. Please try again later.",
          // Preserve code if available and deemed safe, otherwise default
          extensions: { code: formattedError.extensions?.code || "INTERNAL_SERVER_ERROR" },
        };
      }
      // In development, return the detailed error
      return formattedError;
    },
  });

  await server.start();

  // Apply middleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(" ")[1] || "";
        // Pass JWT_SECRET from the top scope, which is now checked and asserted as non-null
        const user = await getUserFromToken(token, JWT_SECRET, prisma);
        return { prisma, user };
      },
    })
  );

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
});
