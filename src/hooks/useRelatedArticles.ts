// src/hooks/useRelatedArticles.ts
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { GET_RELATED_ARTICLES } from "@/lib/graphql/queries";
import { Article } from "@/components/features/articles/ArticleCard";

interface RelatedArticlesResponse {
  relatedArticles: Article[];
}

export const useRelatedArticles = (slug: string, limit: number = 3) => {
  return useQuery<RelatedArticlesResponse, Error>({
    queryKey: ["relatedArticles", slug, limit],
    queryFn: async () => {
      if (!slug) {
        return { relatedArticles: [] };
      }
      return fetchGraphQL<RelatedArticlesResponse>(GET_RELATED_ARTICLES, { slug, limit });
    },
    enabled: !!slug, // Only run the query if the slug is available
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 1,
  });
};
