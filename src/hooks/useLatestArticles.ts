// src/hooks/useLatestArticles.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { GET_LATEST_ARTICLES } from "@/lib/graphql/queries";
import { Article } from "@/components/features/articles/ArticleCard";
import { DocumentNode } from "graphql";

interface FetchLatestArticlesParams {
  pageParam?: number;
  limit: number;
}

interface LatestArticlesResponse {
  articles: Article[];
  totalCount: number;
}

export const useLatestArticles = () => {
  const limit = 6;

  const fetchLatestArticles = async ({ pageParam = 0, limit }: FetchLatestArticlesParams) => {
    const offset = pageParam * limit;
    const data = await fetchGraphQL(GET_LATEST_ARTICLES as unknown as DocumentNode, { limit, offset });
    return data?.latestArticles;
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery(
    'latestArticles',
    ({ pageParam }: { pageParam?: number }) => fetchLatestArticles({ pageParam: pageParam, limit: limit }),
    {
      getNextPageParam: (lastPage?: LatestArticlesResponse, pages?: LatestArticlesResponse[]) => {
        if (lastPage?.articles?.length === limit) {
          return pages.length;
        } else {
          return undefined;
        }
      }
    }
  );

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
