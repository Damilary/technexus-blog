// src/hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { GET_USER_PROFILE } from "@/lib/graphql/queries";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

interface UserProfileResponse {
  userProfile: User;
}

export const useUserProfile = () => {
  return useQuery<UserProfileResponse, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      return fetchGraphQL<UserProfileResponse>(GET_USER_PROFILE);
    },
    // Only fetch when component mounts
    staleTime: Infinity,
    // Don't refetch on window focus for this example
    refetchOnWindowFocus: false,
  });
};
