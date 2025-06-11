// src/hooks/useCategoryPageArticles.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { GET_CATEGORY_PAGE_ARTICLES } from "@/lib/graphql/queries";
import { Article } from "@/components/features/articles/ArticleCard";

interface CategoryPageArticlesResponse {
  categoryArticles: {
    articles: Article[];
    totalCount: number;
  };
}

const fetchCategoryPageArticles = async ({
  pageParam = 0,
  limit = 9,
  slug,
}: {
  pageParam?: number;
  limit?: number;
  slug: string;
}): Promise<CategoryPageArticlesResponse> => {
  const offset = pageParam * limit;
  const data = await fetchGraphQL(GET_CATEGORY_PAGE_ARTICLES, {
    slug,
    limit,
    offset,
  });
  // Ensure the response structure matches the expected type
  if (!data || !data.categoryArticles) {
    throw new Error("Invalid API response structure for category articles");
  }
  return data as CategoryPageArticlesResponse;
};

export function useCategoryPageArticles(slug: string, limit: number = 9) {
  return useInfiniteQuery<CategoryPageArticlesResponse, Error>({
    queryKey: ["categoryPageArticles", slug, limit],
    queryFn: ({ pageParam }) => fetchCategoryPageArticles({ pageParam, limit, slug }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.categoryArticles) return undefined;
      const currentCount = allPages.reduce(
        (acc, page) => acc + (page?.categoryArticles?.articles?.length || 0),
        0
      );
      const totalCount = lastPage.categoryArticles.totalCount;

      if (currentCount >= totalCount) {
        return undefined; // No more pages
      }

      return allPages.length; // Next page number (0-based index)
    },
    enabled: !!slug, // Only run the query if a slug is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
