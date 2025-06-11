// src/hooks/useCategoryArticles.ts
import { useQuery } from '@tanstack/react-query';
import { fetchGraphQL } from '@/lib/api/fetchGraphQL';
import { GET_ARTICLES_BY_CATEGORY } from '@/lib/graphql/queries';
import { Article } from '@/components/features/articles/ArticleCard';

interface UseCategoryArticlesOptions {
  slug: string;
  limit?: number;
}

export function useCategoryArticles({ slug, limit = 4 }: UseCategoryArticlesOptions) {
  return useQuery({
    queryKey: ['categoryArticles', slug, limit],
    queryFn: async () => {
      const data = await fetchGraphQL(GET_ARTICLES_BY_CATEGORY, { slug, limit });
      return data.articlesByCategory as Article[];
    },
    enabled: !!slug, // Only run the query if a category slug is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
