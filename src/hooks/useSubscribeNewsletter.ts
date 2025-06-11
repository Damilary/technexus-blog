// src/hooks/useSubscribeNewsletter.ts
import { useMutation } from '@tanstack/react-query';
import { fetchGraphQL } from '@/lib/api/fetchGraphQL';
import { SUBSCRIBE_TO_NEWSLETTER } from '@/lib/graphql/queries';

interface SubscribeResponse {
  subscribeToNewsletter: {
    success: boolean;
    message: string;
  };
}

interface SubscribeVariables {
  email: string;
}

export const useSubscribeNewsletter = () => {
  return useMutation<SubscribeResponse, Error, SubscribeVariables>({
    mutationFn: async (variables) => {
      const response = await fetchGraphQL<SubscribeResponse>(SUBSCRIBE_TO_NEWSLETTER, variables);
      // Check for backend errors indicated in the response data
      if (!response.subscribeToNewsletter.success) {
        throw new Error(response.subscribeToNewsletter.message || 'Subscription failed.');
      }
      return response;
    },
    // Optional: Add onSuccess, onError, onSettled callbacks if needed
    // onSuccess: (data) => {
    //   console.log('Subscription successful:', data);
    // },
    // onError: (error) => {
    //   console.error('Subscription error:', error);
    // },
  });
};
