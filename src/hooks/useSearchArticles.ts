// src/hooks/useSearchArticles.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { SEARCH_ARTICLES } from "@/lib/graphql/queries";
import { Article } from "@/components/features/articles/ArticleCard";

interface SearchArticlesResponse {
  searchArticles: {
    articles: Article[];
    totalCount: number;
  };
}

const fetchSearchArticles = async ({
  pageParam = 0,
  limit = 10,
  query,
}: {
  pageParam?: number;
  limit?: number;
  query: string;
}): Promise<SearchArticlesResponse> => {
  const offset = pageParam * limit;
  const data = await fetchGraphQL(SEARCH_ARTICLES, {
    query,
    limit,
    offset,
  });
  // Ensure the response structure matches the expected type
  if (!data || !data.searchArticles) {
    throw new Error("Invalid API response structure for search articles");
  }
  return data as SearchArticlesResponse;
};

export function useSearchArticles(query: string, limit: number = 10) {
  return useInfiniteQuery<SearchArticlesResponse, Error>({
    queryKey: ["searchArticles", query, limit],
    queryFn: ({ pageParam }) => fetchSearchArticles({ pageParam, limit, query }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.searchArticles) return undefined;
      const currentCount = allPages.reduce(
        (acc, page) => acc + (page?.searchArticles?.articles?.length || 0),
        0
      );
      const totalCount = lastPage.searchArticles.totalCount;

      if (currentCount >= totalCount) {
        return undefined; // No more pages
      }

      return allPages.length; // Next page number (0-based index)
    },
    enabled: !!query, // Only run the query if a query string is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
