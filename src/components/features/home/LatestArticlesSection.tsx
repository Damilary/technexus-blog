import React, { useEffect, useRef } from 'react';
import { ArticleCard, Article } from '@/components/features/articles/ArticleCard';
import { useLatestArticles } from '@/hooks/useLatestArticles';
import { Skeleton } from '@/components/ui/Skeleton';
import { useInView } from 'react-intersection-observer';
import { Loader2 } from 'lucide-react'; // Using lucide-react for a spinner icon

// Skeleton loader for the article cards
const ArticleCardSkeleton = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-48 w-full rounded-lg" />
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-6 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="flex items-center space-x-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const LatestArticlesSection: React.FC = () => {
  const { 
    data, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    status 
  } = useLatestArticles();

  // Ref for the intersection observer trigger element
  const { ref, inView } = useInView({
    threshold: 0, // Trigger as soon as the element enters the viewport
    rootMargin: '200px', // Trigger when the element is 200px away from the viewport bottom
  });

  useEffect(() => {
    // Fetch next page when the trigger element is in view and there are more pages
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const articles = data?.pages.flatMap(page => page.latestArticles) ?? [];
  const isLoadingInitial = status === 'pending';
  const isError = status === 'error';

  return (
    <section className="py-12 bg-white dark:bg-darkMode-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-8">Latest Articles</h2>

        {isLoadingInitial ? (
          // Initial Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          // Error state
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-2 font-medium">
              Unable to load latest articles
            </p>
            <p className="text-red-500 dark:text-red-300 text-sm">
              {error?.message || 'Please try again later.'}
            </p>
          </div>
        ) : articles.length > 0 ? (
          // Success state with articles
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  variant="standard"
                />
              ))}
            </div>
            
            {/* Infinite scroll trigger and loading indicator */}
            <div ref={ref} className="h-10 mt-8 flex justify-center items-center">
              {isFetchingNextPage && (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              )}
              {!hasNextPage && articles.length > 0 && (
                 <p className="text-gray-500 dark:text-gray-400 text-sm">No more articles to load.</p>
              )}
            </div>
          </>
        ) : (
          // Empty state (no articles found initially)
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
              No articles found
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">
              Check back later for new content
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
