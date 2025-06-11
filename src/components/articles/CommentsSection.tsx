// src/components/features/articles/CommentsSection.tsx
import React, { useState } from "react";
import { UseInfiniteQueryResult } from "@tanstack/react-query";
import { Comment } from "@/hooks/useArticleComments";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth
import { useCreateComment } from "@/hooks/useCreateComment"; // Import useCreateComment
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Textarea } from "@/components/ui/Textarea"; // Assuming Textarea component exists
import Image from "next/image";
import { Loader2, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert"; // Assuming Alert component exists

// Define the expected structure for the comments data prop
interface ArticleCommentsResponse {
  articleComments: {
    comments: Comment[];
    totalCount: number;
  };
}

interface CommentsSectionProps {
  commentsQuery: UseInfiniteQueryResult<ArticleCommentsResponse, Error>;
  articleSlug: string;
}

// --- Comment Item Component --- //
const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <div className="flex items-start space-x-3 py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    {comment.author.avatar ? (
      <Image
        src={comment.author.avatar}
        alt={`Avatar of ${comment.author.name}`}
        width={32}
        height={32}
        className="rounded-full flex-shrink-0 mt-1"
      />
    ) : (
      <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {comment.author.name.charAt(0)}
        </span>
      </div>
    )}
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm text-dark dark:text-white">
          {comment.author.name}
        </span>
        <time className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(comment.createdAt).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric"
          })}
        </time>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {comment.content}
      </p>
    </div>
  </div>
);

// --- Comment Form Component --- //
const CommentForm: React.FC<{ articleSlug: string }> = ({ articleSlug }) => {
  const [content, setContent] = useState("");
  const { user } = useAuth(); // Get user info for avatar
  const createCommentMutation = useCreateComment(articleSlug);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) return; // Prevent empty submissions

    createCommentMutation.mutate(
      { articleSlug, content },
      {
        onSuccess: () => {
          setContent(""); // Clear form on success
          // Optional: Show success toast/message
        },
        // onError is handled below
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-start space-x-3 mb-8">
      {user?.avatar ? (
        <Image
          src={user.avatar}
          alt={`Avatar of ${user.name}`}
          width={32}
          height={32}
          className="rounded-full flex-shrink-0 mt-1"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {user?.name?.charAt(0) ?? "U"}
          </span>
        </div>
      )}
      <div className="flex-1">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add your comment..."
          required
          rows={3}
          className="mb-2"
          disabled={createCommentMutation.isPending}
        />
        {createCommentMutation.error && (
          <Alert variant="destructive" className="mb-2">
            <AlertDescription>
              Error submitting comment: {createCommentMutation.error.message}
            </AlertDescription>
          </Alert>
        )}
        <Button 
          type="submit" 
          disabled={!content.trim() || createCommentMutation.isPending}
          size="sm"
        >
          {createCommentMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Comment
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

// --- Main Comments Section Component --- //
export const CommentsSection: React.FC<CommentsSectionProps> = ({ commentsQuery, articleSlug }) => {
  const { 
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading 
  } = commentsQuery;
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth(); // Check authentication

  // --- Loading State (Initial Comments Load) --- //
  if (isLoading || isAuthLoading) {
    return (
      <div>
        <Skeleton className="h-24 w-full mb-8" /> {/* Form skeleton */}
        <Skeleton className="h-16 w-full mb-4" /> {/* Comment skeleton */}
        <Skeleton className="h-16 w-full mb-4" />
        <Skeleton className="h-16 w-full mb-4" />
      </div>
    );
  }

  // --- Error State (Initial Comments Load) --- //
  if (error) {
    return <p className="text-red-500">Error loading comments: {error.message}</p>;
  }

  const allComments = data?.pages.flatMap(page => page.articleComments.comments) ?? [];
  const totalCount = data?.pages[0]?.articleComments?.totalCount ?? 0;

  return (
    <div>
      {/* Comment Submission Form (Conditional) */}
      {isAuthenticated ? (
        <CommentForm articleSlug={articleSlug} />
      ) : (
        <div className="mb-8 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Please log in to leave a comment.
          </p>
          {/* Optional: Add Login Button/Link */}
        </div>
      )}

      {/* Comments List */}
      {allComments.length > 0 ? (
        <div className="space-y-0">
          {allComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Be the first to comment!
        </p>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="mt-6 text-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Comments"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
