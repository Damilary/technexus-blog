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

export const HeroSection: React.FC<HeroSectionProps> = ({ article: initialArticle }) => {
  // Fetch hero article data using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['heroArticle'],
    queryFn: async () => {
      const { heroArticle } = await fetchGraphQL(GET_HERO_ARTICLE);
      return heroArticle as HeroArticle;
    },
    // If we have initial data (e.g., from SSR), use it
    initialData: initialArticle,
    // Only fetch if we don't have initial data
    enabled: !initialArticle,
  });

  // Loading state
  if (isLoading) {
    return (
      <section className="bg-light dark:bg-darkMode-bg py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden animate-pulse">
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
      <section className="bg-light dark:bg-darkMode-bg py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 md:p-8 lg:p-10 text-center">
              <div className="text-error mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-dark dark:text-white mb-2">Failed to load featured article</h2>
              <p className="text-dark-light dark:text-medium-light mb-6">
                We couldn't load the featured article at this time. Please try again later.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // No data state (should not happen with proper API, but just in case)
  if (!data) {
    return (
      <section className="bg-light dark:bg-darkMode-bg py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden">
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

  // Success state with data
  return (
    <section className="bg-light dark:bg-darkMode-bg py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-dark shadow-lg rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image side */}
            <div className="relative h-64 md:h-80 lg:h-full">
              {data.coverImage ? (
                <Link href={`/articles/${data.slug}`} className="block h-full">
                  <Image 
                    src={data.coverImage}
                    alt={data.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </Link>
              ) : (
                <div className="absolute inset-0 bg-light-dark flex items-center justify-center text-dark dark:text-white">
                  No Image Available
                </div>
              )}
            </div>
            
            {/* Content side */}
            <div className="p-6 md:p-8 lg:p-10">
              <div className="flex items-center mb-4">
                <Link 
                  href={`/categories/${data.category.slug}`}
                  className="bg-primary text-white text-xs font-medium px-2.5 py-0.5 rounded hover:bg-primary-hover transition-colors"
                >
                  {data.category.name}
                </Link>
                <time className="ml-2 text-medium text-sm" dateTime={data.publishedAt}>
                  {new Date(data.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
              <Link href={`/articles/${data.slug}`} className="block group">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark dark:text-white mb-4 group-hover:text-primary transition-colors">
                  {data.title}
                </h1>
              </Link>
              
              <p className="text-dark-light dark:text-medium-light mb-6">
                {data.excerpt}
              </p>
              
              <div className="flex items-center">
                {data.author.avatar ? (
                  <Image 
                    src={data.author.avatar}
                    alt={data.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-medium">
                    {data.author.name.charAt(0)}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-dark dark:text-white">{data.author.name}</p>
                  {data.author.role && (
                    <p className="text-xs text-medium">{data.author.role}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
