'use client';

import React from 'react';
import Link from 'next/link';
import { ArticleCard, Article } from '@/components/features/articles/ArticleCard';
import { useFeaturedArticles } from '@/hooks/useFeaturedArticles';

interface FeaturedArticlesSectionProps {
  articles?: Article[]; // Optional for SSR or static data
  title?: string;
  limit?: number;
}

export const FeaturedArticlesSection: React.FC<FeaturedArticlesSectionProps> = ({ 
  articles: initialArticles,
  title = "Featured Articles",
  limit = 3
}) => {
  // Fetch featured articles data using React Query
  const { data, isLoading, error } = useFeaturedArticles({
    limit,
    initialData: initialArticles,
    enabled: !initialArticles,
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-white dark:bg-darkMode-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-8">{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="bg-light dark:bg-dark rounded-lg overflow-hidden shadow-md animate-pulse">
                <div className="h-48 bg-light-dark"></div>
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <div className="h-5 w-16 bg-light-dark rounded"></div>
                    <div className="ml-2 h-4 w-24 bg-light-dark rounded"></div>
                  </div>
                  <div className="h-6 w-3/4 bg-light-dark rounded mb-3"></div>
                  <div className="h-4 w-full bg-light-dark rounded mb-2"></div>
                  <div className="h-4 w-full bg-light-dark rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-light-dark rounded mb-4"></div>
                  <div className="flex items-center mt-4">
                    <div className="h-8 w-8 rounded-full bg-light-dark"></div>
                    <div className="ml-2">
                      <div className="h-3 w-20 bg-light-dark rounded mb-1"></div>
                      <div className="h-3 w-16 bg-light-dark rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-12 bg-white dark:bg-darkMode-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-4">{title}</h2>
          <div className="bg-light dark:bg-dark rounded-lg p-6 text-center">
            <div className="text-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark dark:text-white mb-2">Failed to load featured articles</h3>
            <p className="text-dark-light dark:text-medium-light mb-6">
              We couldn't load the featured articles at this time. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary-hover text-white font-medium px-4 py-2 rounded-md transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No data state (should not happen with proper API, but just in case)
  if (!data || data.length === 0) {
    return (
      <section className="py-12 bg-white dark:bg-darkMode-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-4">{title}</h2>
          <div className="bg-light dark:bg-dark rounded-lg p-6 text-center">
            <p className="text-dark-light dark:text-medium-light">
              No featured articles available at this time.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Success state with data
  return (
    <section className="py-12 bg-white dark:bg-darkMode-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white">{title}</h2>
          <Link 
            href="/featured"
            className="text-primary hover:text-primary-hover font-medium transition-colors"
          >
            View All
            <span className="ml-1">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              variant={data.length <= 3 ? "featured" : "default"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
