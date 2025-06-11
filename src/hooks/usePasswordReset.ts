
// src/hooks/usePasswordReset.ts
import { useMutation } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { REQUEST_PASSWORD_RESET, RESET_PASSWORD } from "@/lib/graphql/queries";

// --- Request Password Reset Hook ---

interface RequestResetResponse {
  requestPasswordReset: {
    success: boolean;
    message: string;
  };
}

interface RequestResetVariables {
  email: string;
}

export const useRequestPasswordReset = () => {
  return useMutation<RequestResetResponse, Error, RequestResetVariables>({
    mutationFn: async (variables) => {
      const response = await fetchGraphQL<RequestResetResponse>(
        REQUEST_PASSWORD_RESET,
        variables
      );
      // Check for backend errors indicated in the response data
      if (!response.requestPasswordReset.success) {
        throw new Error(
          response.requestPasswordReset.message || "Failed to request password reset."
        );
      }
      return response;
    },
    // Optional: Add onSuccess, onError, onSettled callbacks if needed
  });
};

// --- Reset Password Hook ---

interface ResetPasswordResponse {
  resetPassword: {
    success: boolean;
    message: string;
  };
}

interface ResetPasswordVariables {
  token: string;
  newPassword: string;
}

export const useResetPassword = () => {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordVariables>({
    mutationFn: async (variables) => {
      const response = await fetchGraphQL<ResetPasswordResponse>(
        RESET_PASSWORD,
        variables
      );
      // Check for backend errors indicated in the response data
      if (!response.resetPassword.success) {
        throw new Error(
          response.resetPassword.message || "Failed to reset password."
        );
      }
      return response;
    },
    // Optional: Add onSuccess, onError, onSettled callbacks if needed
  });
};

