import { useState, useCallback } from "react";
import { Article } from "@/types";
import { graphqlRequest } from "@/lib/api/graphqlClient";
import { handleError, AppError, ErrorCodes } from "@/lib/error";

const GET_ARTICLES = `
  query GetArticles($limit: Int, $offset: Int) {
    articles(limit: $limit, offset: $offset) {
      id
      title
      excerpt
      slug
      publishedAt
      author {
        id
        name
        image
      }
      tags {
        id
        name
      }
    }
  }
`;

interface UseArticlesOptions {
  initialLimit?: number;
}

export function useArticles({ initialLimit = 10 }: UseArticlesOptions = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchArticles = useCallback(
    async (offset = 0, limit = initialLimit) => {
      setLoading(true);
      setError(null);

      try {
        const response = await graphqlRequest<{ articles: Article[] }>(
          GET_ARTICLES,
          {
            limit,
            offset,
          }
        );

        if (offset === 0) {
          setArticles(response.articles);
        } else {
          setArticles((prev) => [...prev, ...response.articles]);
        }

        setHasMore(response.articles.length === limit);
      } catch (err) {
        const error = handleError(err);
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [initialLimit]
  );

  const refreshArticles = useCallback(() => {
    return fetchArticles(0);
  }, [fetchArticles]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      return fetchArticles(articles.length);
    }
  }, [loading, hasMore, articles.length, fetchArticles]);

  return {
    articles,
    loading,
    error,
    hasMore,
    fetchArticles,
    refreshArticles,
    loadMore,
  };
}
