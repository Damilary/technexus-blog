"use client";
// src/hooks/useCategoryArticles.ts
import { useQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { GET_ARTICLES_BY_CATEGORY_SHOWCASE } from "@/lib/graphql/queries";
import { Article } from "@/components/features/articles/ArticleCard";

interface UseCategoryArticlesOptions {
  slug: string;
  limit?: number;
}

export function useCategoryArticles({
  slug,
  limit = 4,
}: UseCategoryArticlesOptions) {
  return useQuery({
    queryKey: ["categoryArticles", slug, limit],
    queryFn: async () => {
      // Explicitly cast GET_ARTICLES_BY_CATEGORY_SHOWCASE to DocumentNode as a workaround
      const data = await fetchGraphQL(GET_ARTICLES_BY_CATEGORY_SHOWCASE as any, { // Using 'any' temporarily for casting
        slug,
        limit,
      });
      return data.articlesByCategory as Article[];
    },
    enabled: !!slug, // Only run the query if a category slug is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
