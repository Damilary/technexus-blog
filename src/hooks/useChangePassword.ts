// src/hooks/useChangePassword.ts
import { useMutation } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { CHANGE_PASSWORD } from "@/lib/graphql/queries";

interface ChangePasswordVariables {
  currentPassword: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  changePassword: {
    success: boolean;
    message: string;
  };
}

export const useChangePassword = () => {
  return useMutation<{ success: boolean; message: string }, Error, ChangePasswordVariables>({
    mutationFn: async (variables) => {
      const response = await fetchGraphQL<ChangePasswordResponse>(CHANGE_PASSWORD, variables);
      return response.changePassword;
    },
  });
};
