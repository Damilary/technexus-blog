// backend/src/index.ts
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './graphql/typeDefs';
import { resolvers, userResolvers } from './graphql/resolvers'; // Your resolvers
import { getUserFromToken } from './middleware/auth'; // Hypothetical auth middleware
import { PrismaClient } from './generated/prisma'; // Import PrismaClient
import { Context } from './graphql/types'; // Import your context type

// use `prisma` in your application to read and write data in your DB
const prisma = new PrismaClient()

// Merge resolvers (if you decide to keep userResolvers separate and merge them)
const combinedResolvers = {
  Query: resolvers.Query,
  Mutation: {
    ...resolvers.Mutation,
    ...userResolvers.Mutation, // This will overwrite the signup in resolvers.Mutation
  },
};

// Initialize Express app
const app = express();
const PORT = process.env.PORT ?? 4000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI ?npm install? 'mongodb://localhost:27017/technexus-blog';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Initialize Apollo Server
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // Add authentication context here
      return { req };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`GraphQL endpoint at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch((error) => {
  console.error('Failed to start server:', error);
});


const server = new ApolloServer<Context>({
  typeDefs,
  resolvers: combinedResolvers, // Or just 'resolvers' if you consolidate signup
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1] || '';
      const user = await getUserFromToken(token, JWT_SECRET!, prisma); // Pass JWT_SECRET here
      return { prisma, user };
    },
    listen: { port: 4000 },
  });
  console.log(`🚀 Server ready at ${url}`);
}

startServer();