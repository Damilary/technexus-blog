"use client";

import { useQuery } from "@tanstack/react-query";
import { GET_FEATURED_ARTICLES } from "@lib/queries";
import { fetchGraphQL } from "@lib/fetchGraphQL";
import { Article } from "@/components/features/articles/ArticleCard";

interface UseFeaturedArticlesOptions {
  limit?: number;
  enabled?: boolean;
  initialData?: Article[];
}

/**
 * Custom hook for fetching featured articles
 *
 * @param options Configuration options for the query
 * @returns Query result with loading, error, and data states
 */
export function useFeaturedArticles(options: UseFeaturedArticlesOptions = {}) {
  const { limit = 3, enabled = true, initialData } = options;

  return useQuery({
    queryKey: ["featuredArticles", limit],
    queryFn: async () => {
      const { featuredArticles } = await fetchGraphQL(GET_FEATURED_ARTICLES, {
        limit,
      });
      return featuredArticles as Article[];
    },
    initialData,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
