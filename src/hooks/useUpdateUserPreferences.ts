// src/hooks/useUpdateUserPreferences.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { UPDATE_USER_PREFERENCES } from "@/lib/graphql/queries";
import { UserPreferences } from "./useUserPreferences";

interface UpdateUserPreferencesVariables {
  darkMode?: boolean;
  emailNotificationsEnabled?: boolean;
  favoriteCategories?: string[];
  preferredLevel?: string;
  preferredFormats?: string[];
}

interface UpdateUserPreferencesResponse {
  updateUserPreferences: UserPreferences;
}

export const useUpdateUserPreferences = () => {
  const queryClient = useQueryClient();

  return useMutation<UserPreferences, Error, UpdateUserPreferencesVariables>({
    mutationFn: async (variables) => {
      const response = await fetchGraphQL<UpdateUserPreferencesResponse>(UPDATE_USER_PREFERENCES, variables);
      return response.updateUserPreferences;
    },
    onSuccess: (data) => {
      // Update the userPreferences query data in the cache
      queryClient.setQueryData(["userPreferences"], { userPreferences: data });
      
      // Invalidate the query to ensure fresh data on next fetch
      queryClient.invalidateQueries({ queryKey: ["userPreferences"] });
    },
  });
};
