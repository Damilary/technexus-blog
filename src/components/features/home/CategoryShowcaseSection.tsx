"use client";
import React from 'react';
import Link from 'next/link';
import { ArticleCard, Article } from '@/components/features/articles/ArticleCard';
import { useCategoryArticles } from '@/hooks/useCategoryArticles';
import { Skeleton } from '@/components/ui/Skeleton';

interface CategoryShowcaseSectionProps {
  title: string;
  categorySlug: string;
  limit?: number;
}

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

export const CategoryShowcaseSection: React.FC<CategoryShowcaseSectionProps> = ({
  title,
  categorySlug,
  limit = 4
}) => {
  const { data: articles, isLoading, error } = useCategoryArticles({ 
    slug: categorySlug,
    limit
  });

  return (
    <section className="py-12 bg-light dark:bg-darkMode-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white">{title}</h2>
          <Link 
            href={`/categories/${categorySlug}`} 
            className="text-primary hover:text-primary-hover font-medium transition-colors"
          >
            View All
          </Link>
        </div>

        {isLoading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <ArticleCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-600 dark:text-red-400 mb-2 font-medium">
              Unable to load articles for this category
            </p>
            <p className="text-red-500 dark:text-red-300 text-sm">
              Please try again later or check another category
            </p>
          </div>
        ) : articles && articles.length > 0 ? (
          // Success state with articles
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                variant="compact"
              />
            ))}
          </div>
        ) : (
          // Empty state (no articles found)
          <div className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2 font-medium">
              No articles found for this category
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
