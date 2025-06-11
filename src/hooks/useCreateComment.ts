// src/hooks/useCreateComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGraphQL } from "@/lib/api/fetchGraphQL";
import { CREATE_COMMENT } from "@/lib/graphql/queries";
import { Comment } from "./useArticleComments"; // Import Comment type

interface CreateCommentVariables {
  articleSlug: string;
  content: string;
}

interface CreateCommentResponse {
  createComment: Comment;
}

export const useCreateComment = (articleSlug: string) => {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, CreateCommentVariables>({
    mutationFn: async (variables) => {
      // In a real app, the backend would associate the comment with the logged-in user.
      // The variables here only need the content and article slug.
      const response = await fetchGraphQL<CreateCommentResponse>(CREATE_COMMENT, variables);
      return response.createComment;
    },
    onSuccess: () => {
      // Invalidate the comments query for the specific article to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["articleComments", articleSlug] });
      // Optionally, you could optimistically update the comments list here
      // for a smoother UI experience, but invalidation is simpler.
    },
    // onError can be handled globally or locally in the component using the mutation
  });
};
