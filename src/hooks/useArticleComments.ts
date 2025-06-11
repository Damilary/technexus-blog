// src/hooks/useArticleComments.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { GET_ARTICLE_COMMENTS } from "@/lib/graphql/queries";

// Define the structure of a single comment based on COMMENT_FRAGMENT
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ArticleCommentsPage {
  comments: Comment[];
  totalCount: number;
}

interface ArticleCommentsResponse {
  articleComments: ArticleCommentsPage;
}

const COMMENTS_PER_PAGE = 10;

export const useArticleComments = (slug: string) => {
  return useInfiniteQuery<ArticleCommentsResponse, Error>({
    queryKey: ["articleComments", slug],
    queryFn: async ({ pageParam = 0 }) => {
      if (!slug) {
        // Should not happen if enabled is set correctly, but good practice
        throw new Error("Article slug is required to fetch comments.");
      }
      const offset = pageParam * COMMENTS_PER_PAGE;
      return fetchGraphQL<ArticleCommentsResponse>(GET_ARTICLE_COMMENTS, {
        slug,
        limit: COMMENTS_PER_PAGE,
        offset,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedComments = allPages.reduce((acc, page) => acc + page.articleComments.comments.length, 0);
      const totalComments = lastPage.articleComments.totalCount;
      
      if (loadedComments < totalComments) {
        return allPages.length; // Return the next page number (0-based index)
      }
      return undefined; // No more pages
    },
    initialPageParam: 0, // Start with the first page
    enabled: !!slug, // Only run the query if the slug is available
    staleTime: 1000 * 60 * 2, // 2 minutes stale time for comments
    retry: 1,
  });
};
