// src/lib/api/graphqlClient.ts
import { GraphQLClient } from 'graphql-request';

// Create a GraphQL client instance
// In a real implementation, this would point to your actual GraphQL endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.technexus-blog.com/graphql';

export const graphqlClient = new GraphQLClient(API_URL, {
  headers: {
    // Add any default headers here
  },
});

// Function to add auth token to requests when available
export const setAuthToken = (token: string | null) => {
  if (token) {
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
  } else {
    graphqlClient.setHeader('Authorization', '');
  }
};
