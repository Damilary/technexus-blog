'use client';

import { graphqlClient } from './graphqlClient';
import { mockGraphQLHandler } from './mockData';

// Determine if we should use mock data
// In a real app, this would be controlled by environment variables
const USE_MOCK_DATA = true;

/**
 * Enhanced GraphQL client that can switch between real API and mock data
 * @param query GraphQL query string
 * @param variables Optional variables for the query
 * @returns Query result
 */
export async function fetchGraphQL(query: string, variables?: any) {
  if (USE_MOCK_DATA) {
    console.log('Using mock data for GraphQL query');
    return mockGraphQLHandler(query, variables);
  } else {
    console.log('Using real API for GraphQL query');
    return graphqlClient.request(query, variables);
  }
}
