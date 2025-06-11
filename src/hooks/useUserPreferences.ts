// src/hooks/useUserPreferences.ts
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { GET_USER_PREFERENCES } from "@/lib/graphql/queries";

export interface UserPreferences {
  id: string;
  userId: string;
  darkMode: boolean;
  emailNotificationsEnabled: boolean;
  favoriteCategories: string[];
  preferredLevel: string; // e.g., "beginner", "intermediate", "advanced"
  preferredFormats: string[]; // e.g., ["article", "tutorial", "video"]
}

interface UserPreferencesResponse {
  userPreferences: UserPreferences;
}

export const useUserPreferences = () => {
  return useQuery<UserPreferencesResponse, Error>({
    queryKey: ["userPreferences"],
    queryFn: async () => {
      return fetchGraphQL<UserPreferencesResponse>(GET_USER_PREFERENCES);
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
