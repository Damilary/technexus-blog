// backend/src/index.ts
import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

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

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";
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
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers: combinedResolvers,
    formatError: (error) => {
      console.error("GraphQL Error:", error);
      return error;
    },
  });

  await server.start();

  // Apply middleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => {
        const token = req.headers.authorization?.split(" ")[1] || "";
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
