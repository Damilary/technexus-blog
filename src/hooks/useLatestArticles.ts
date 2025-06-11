// src/hooks/useLatestArticles.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchGraphQL } from '@/lib/api/fetchGraphQL';
import { GET_LATEST_ARTICLES } from '@/lib/graphql/queries';
import { Article } from '@/components/features/articles/ArticleCard';

interface LatestArticlesResponse {
  latestArticles: Article[];
  totalArticlesCount: number;
}

const fetchLatestArticles = async ({ pageParam = 0, limit = 6 }: { pageParam?: number, limit?: number }): Promise<LatestArticlesResponse> => {
  const offset = pageParam * limit;
  const data = await fetchGraphQL(GET_LATEST_ARTICLES, { limit, offset });
  return data as LatestArticlesResponse;
};

export function useLatestArticles(limit: number = 6) {
  return useInfiniteQuery<LatestArticlesResponse, Error>({
    queryKey: ['latestArticles', limit],
    queryFn: ({ pageParam }) => fetchLatestArticles({ pageParam, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentCount = allPages.reduce((acc, page) => acc + page.latestArticles.length, 0);
      const totalCount = lastPage.totalArticlesCount;
      
      if (currentCount >= totalCount) {
        return undefined; // No more pages
      }
      
      return allPages.length; // Next page number (0-based index)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
