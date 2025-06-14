// src/lib/api/graphqlClient.ts
import { GraphQLClient } from 'graphql-request';
import { validateEnv } from '@/lib/env';
import { handleError, AppError, ErrorCodes } from '@/lib/error';

// Validate required environment variables
validateEnv(['NEXT_PUBLIC_API_URL']);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new AppError('API URL is not configured', ErrorCodes.SERVER_ERROR);
}

export const graphqlClient = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
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

// Wrapper for GraphQL requests with error handling
export async function graphqlRequest<T, V = Record<string, unknown>>(
  query: string,
  variables?: V
): Promise<T> {
  try {
    return await graphqlClient.request<T, V>(query, variables);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Network request failed')) {
        throw new AppError('Network request failed', ErrorCodes.NETWORK_ERROR);
      }
      if (error.message.includes('401')) {
        throw new AppError('Authentication required', ErrorCodes.AUTHENTICATION_ERROR);
      }
      if (error.message.includes('403')) {
        throw new AppError('Not authorized', ErrorCodes.AUTHORIZATION_ERROR);
      }
    }
    return handleError(error);
  }
}
