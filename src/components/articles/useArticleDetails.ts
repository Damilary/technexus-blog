// src/hooks/useArticleDetails.ts
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { GET_ARTICLE_DETAILS } from "@/lib/graphql/queries";
import { Article } from "@/components/features/articles/ArticleCard"; // Assuming Article type includes all details now

interface ArticleDetailsResponse {
  article: Article | null;
}

export const useArticleDetails = (slug: string) => {
  return useQuery<ArticleDetailsResponse, Error>({
    queryKey: ["articleDetails", slug],
    queryFn: async () => {
      if (!slug) {
        // Avoid fetching if slug is not available (e.g., during initial render)
        return { article: null };
      }
      return fetchGraphQL<ArticleDetailsResponse>(GET_ARTICLE_DETAILS, { slug });
    },
    enabled: !!slug, // Only run the query if the slug is available
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Retry once on failure
  });
};
