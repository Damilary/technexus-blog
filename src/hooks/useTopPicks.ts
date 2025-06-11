"use client";

import { useQuery } from "@tanstack/react-query";
import { GET_TOP_PICKS } from "../lib/graphql/queries";
import { fetchGraphQL } from "../lib/api/fetchGraphQL";
import { Article } from "@/components/features/articles/ArticleCard";

interface UseTopPicksOptions {
  limit?: number;
  enabled?: boolean;
  initialData?: Article[];
}

/**
 * Custom hook for fetching top picks articles
 *
 * @param options Configuration options for the query
 * @returns Query result with loading, error, and data states
 */
export function useTopPicks(options: UseTopPicksOptions = {}) {
  const { limit = 5, enabled = true, initialData } = options;

  return useQuery({
    queryKey: ["topPicks", limit],
    queryFn: async () => {
      const { topPicks } = await fetchGraphQL(GET_TOP_PICKS, { limit });
      return topPicks as Article[];
    },
    initialData,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
