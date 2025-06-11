// src/hooks/useEmailVerification.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockGraphQLHandler } from "@/lib/api/mockData";
import {
  REQUEST_EMAIL_VERIFICATION,
  VERIFY_EMAIL,
} from "@/lib/graphql/queries";
import { User } from "@/hooks/useUserProfile"; // Assuming User type is defined here or imported

// --- Request Verification Email --- //

interface RequestVerificationResponse {
  requestEmailVerification: {
    success: boolean;
    message: string;
  };
}

export const useRequestEmailVerification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RequestVerificationResponse,
    Error,
    void // No variables needed for this mutation
  >({
    mutationFn: async () => {
      return await mockGraphQLHandler<RequestVerificationResponse>(
        REQUEST_EMAIL_VERIFICATION
      );
    },
    onSuccess: (data) => {
      console.log(
        "Request Email Verification Success:",
        data.requestEmailVerification.message
      );
      // Potentially show a success toast or notification here
    },
    onError: (error) => {
      console.error("Request Email Verification Error:", error);
      // Potentially show an error toast or notification here
    },
  });
};

// --- Verify Email with Token --- //

interface VerifyEmailVariables {
  token: string;
}

interface VerifyEmailResponse {
  verifyEmail: {
    success: boolean;
    message: string;
    user: User | null; // User object might be returned on success
  };
}

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation<VerifyEmailResponse, Error, VerifyEmailVariables>({
    mutationFn: async (variables) => {
      return await mockGraphQLHandler<VerifyEmailResponse>(VERIFY_EMAIL, variables);
    },
    onSuccess: (data) => {
      console.log("Verify Email Success:", data.verifyEmail.message);
      if (data.verifyEmail.success && data.verifyEmail.user) {
        // If verification is successful and user data is returned,
        // potentially update the user profile cache or auth state.
        queryClient.setQueryData(["userProfile"], { userProfile: data.verifyEmail.user });
        // You might also need to update the Zustand store if it holds verification status
        // useAuthStore.setState({ user: data.verifyEmail.user });
      }
    },
    onError: (error) => {
      console.error("Verify Email Error:", error);
    },
  });
};

