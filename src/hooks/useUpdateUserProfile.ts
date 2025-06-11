// src/hooks/useUpdateUserProfile.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { UPDATE_USER_PROFILE } from "@/lib/graphql/queries";
import { User } from "./useUserProfile";

interface UpdateUserProfileVariables {
  name?: string;
  bio?: string;
  avatar?: string;
}

interface UpdateUserProfileResponse {
  updateUserProfile: User;
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserProfileVariables>({
    mutationFn: async (variables) => {
      const response = await fetchGraphQL<UpdateUserProfileResponse>(UPDATE_USER_PROFILE, variables);
      return response.updateUserProfile;
    },
    onSuccess: (data) => {
      // Update the userProfile query data in the cache
      queryClient.setQueryData(["userProfile"], { userProfile: data });
      
      // Invalidate the query to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
