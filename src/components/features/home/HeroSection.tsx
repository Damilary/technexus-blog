'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { GET_HERO_ARTICLE } from '@/lib/graphql/queries';
import { fetchGraphQL } from '@/lib/api/fetchGraphQL';

export interface HeroArticle {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  category: {
    name: string;
    slug: string;
  };
  publishedAt: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
  };
}

interface HeroSectionProps {
  article?: HeroArticle; // Optional for SSR or static data
}

interface GraphQLResponse {
  heroArticle: HeroArticle;
}

interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: string[];
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const HeroSection: React.FC<HeroSectionProps> = ({ article: initialArticle }) => {
  // Fetch hero article data using React Query
  const { data, isLoading, error } = useQuery<GraphQLResponse, GraphQLError>({
    queryKey: ['heroArticle'],
    queryFn: async () => {
      const response = await fetchGraphQL<GraphQLResponse>(GET_HERO_ARTICLE);
      if (!response?.heroArticle) {
        throw new Error('No hero article found');
      }
      return response;
    },
    initialData: initialArticle ? { heroArticle: initialArticle } : undefined,
    enabled: !initialArticle,
  });

  // Loading state
  if (isLoading) {
    return (
      <section 
        className="bg-light dark:bg-darkMode-bg py-12 md:py-16 lg:py-20"
        aria-label="Featured article loading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden animate-pulse"
            role="alert"
            aria-busy="true"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image skeleton */}
              <div className="relative h-64 md:h-80 lg:h-96 bg-light-dark"></div>
              
              {/* Content skeleton */}
              <div className="p-6 md:p-8 lg:p-10">
                <div className="flex items-center mb-4">
                  <div className="h-6 w-24 bg-light-dark rounded"></div>
                  <div className="ml-2 h-4 w-32 bg-light-dark rounded"></div>
                </div>
                <div className="h-10 w-3/4 bg-light-dark rounded mb-4"></div>
                <div className="h-4 w-full bg-light-dark rounded mb-2"></div>
                <div className="h-4 w-full bg-light-dark rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-light-dark rounded mb-6"></div>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-light-dark"></div>
                  <div className="ml-3">
                    <div className="h-4 w-24 bg-light-dark rounded mb-1"></div>
                    <div className="h-3 w-16 bg-light-dark rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section 
        className="bg-light dark:bg-darkMode-bg py-12 md:py-16 lg:py-20"
        aria-label="Featured article error"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden"
            role="alert"
            aria-live="assertive"
          >
            <div className="p-6 md:p-8 lg:p-10 text-center">
              <div className="text-error mb-4" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-2">Failed to load featured article</h2>
              <p className="text-dark-light dark:text-medium-light mb-6">
                {error.message || 'We couldn\'t load the featured article at this time. Please try again later.'}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                aria-label="Refresh page"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No data state
  if (!data?.heroArticle) {
    return (
      <section 
        className="bg-light dark:bg-darkMode-bg py-12 md:py-16 lg:py-20"
        aria-label="No featured article"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden"
            role="alert"
          >
            <div className="p-6 md:p-8 lg:p-10 text-center">
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-2">No featured article available</h2>
              <p className="text-dark-light dark:text-medium-light">
                Check back later for featured content.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const { heroArticle: article } = data;

  return (
    <section 
      className="bg-light dark:bg-darkMode-bg py-12 md:py-16 lg:py-20"
      aria-label="Featured article"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image side */}
            <div className="relative h-64 md:h-80 lg:h-full">
              {article.coverImage ? (
                <Link 
                  href={`/articles/${article.slug}`} 
                  className="block h-full focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label={`Read ${article.title}`}
                >
                  <Image 
                    src={article.coverImage}
                    alt={`Cover image for article: ${article.title}`}
                    fill
                    className="object-cover"
                    priority
                  />
                </Link>
              ) : (
                <div 
                  className="absolute inset-0 bg-light-dark flex items-center justify-center text-dark dark:text-white"
                  aria-hidden="true"
                >
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Content side */}
            <div className="p-6 md:p-8 lg:p-10">
              <div className="flex items-center mb-4">
                <Link 
                  href={`/categories/${article.category.slug}`}
                  className="bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded hover:bg-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span className="sr-only">Category: </span>
                  {article.category.name}
                </Link>
                <time 
                  className="ml-2 text-medium text-sm" 
                  dateTime={article.publishedAt}
                  aria-label={`Published on ${formatDate(article.publishedAt)}`}
                >
                  {formatDate(article.publishedAt)}
                </time>
              </div>
              
              <Link 
                href={`/articles/${article.slug}`} 
                className="block group focus:outline-none"
              >
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark dark:text-white mb-4 group-hover:text-primary group-focus:text-primary transition-colors">
                  {article.title}
                </h1>
              </Link>
              
              <p className="text-dark-light dark:text-medium-light mb-6">
                {article.excerpt}
              </p>
              
              <div className="flex items-center">
                {article.author.avatar ? (
                  <Image 
                    src={article.author.avatar}
                    alt={`${article.author.name}'s profile picture`}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div 
                    className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-medium"
                    aria-hidden="true"
                  >
                    {article.author.name.charAt(0)}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-dark dark:text-white">{article.author.name}</p>
                  {article.author.role && (
                    <p className="text-xs text-medium">
                      <span className="sr-only">Role: </span>
                      {article.author.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
