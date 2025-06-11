"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Article,
  ArticleCard,
} from "@/components/features/articles/ArticleCard";
import { useTopPicks } from "@hooks/useTopPicks";

interface TopPicksSectionProps {
  articles?: Article[]; // Optional for SSR or static data
  limit?: number;
}

export const TopPicksSection: React.FC<TopPicksSectionProps> = ({
  articles: initialArticles,
  limit = 5,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch top picks data using React Query
  const { data, isLoading, error } = useTopPicks({
    limit,
    initialData: initialArticles,
    enabled: !initialArticles,
  });

  // Check scroll possibilities when component mounts or articles change
  useEffect(() => {
    if (!isLoading && data) {
      checkScrollability();
      // Add resize listener to recheck scrollability when window size changes
      window.addEventListener("resize", checkScrollability);
      return () => window.removeEventListener("resize", checkScrollability);
    }
  }, [isLoading, data]);

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // 10px buffer
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8; // Scroll 80% of the visible width

      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });

      // Update scroll buttons state after scrolling
      setTimeout(checkScrollability, 300);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-12 bg-white dark:bg-darkMode-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 bg-light-dark dark:bg-dark-light rounded animate-pulse"></div>
            <div className="flex space-x-2">
              <div className="h-9 w-9 rounded-full bg-light-dark dark:bg-dark-light animate-pulse"></div>
              <div className="h-9 w-9 rounded-full bg-light-dark dark:bg-dark-light animate-pulse"></div>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide">
            {Array.from({ length: limit }).map((_, index) => (
              <div key={index} className="flex-none w-80">
                <div className="bg-light dark:bg-dark rounded-lg overflow-hidden shadow-md animate-pulse h-full">
                  <div className="h-48 bg-light-dark dark:bg-dark-light"></div>
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="h-5 w-16 bg-light-dark dark:bg-dark-light rounded"></div>
                      <div className="ml-2 h-4 w-24 bg-light-dark dark:bg-dark-light rounded"></div>
                    </div>
                    <div className="h-6 w-3/4 bg-light-dark dark:bg-dark-light rounded mb-3"></div>
                    <div className="h-4 w-full bg-light-dark dark:bg-dark-light rounded mb-2"></div>
                    <div className="h-4 w-full bg-light-dark dark:bg-dark-light rounded mb-2"></div>
                    <div className="h-4 w-2/3 bg-light-dark dark:bg-dark-light rounded mb-4"></div>
                    <div className="flex items-center mt-4">
                      <div className="h-8 w-8 rounded-full bg-light-dark dark:bg-dark-light"></div>
                      <div className="ml-2">
                        <div className="h-3 w-20 bg-light-dark dark:bg-dark-light rounded mb-1"></div>
                        <div className="h-3 w-16 bg-light-dark dark:bg-dark-light rounded"></div>
                      </div>
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
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-4">
            Top Picks For You
          </h2>
          <div className="bg-light dark:bg-dark rounded-lg p-6 text-center">
            <div className="text-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-dark dark:text-white mb-2">
              Failed to load top picks
            </h3>
            <p className="text-dark-light dark:text-medium-light mb-6">
              We couldn't load the top picks at this time. Please try again
              later.
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
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-4">
            Top Picks For You
          </h2>
          <div className="bg-light dark:bg-dark rounded-lg p-6 text-center">
            <p className="text-dark-light dark:text-medium-light">
              No top picks available at this time.
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
          <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white">
            Top Picks For You
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full ${
                canScrollLeft
                  ? "bg-light dark:bg-dark text-dark dark:text-white hover:bg-light-dark dark:hover:bg-dark-light"
                  : "bg-light-dark dark:bg-dark-light text-medium cursor-not-allowed"
              }`}
              aria-label="Scroll left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full ${
                canScrollRight
                  ? "bg-light dark:bg-dark text-dark dark:text-white hover:bg-light-dark dark:hover:bg-dark-light"
                  : "bg-light-dark dark:bg-dark-light text-medium cursor-not-allowed"
              }`}
              aria-label="Scroll right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide"
          onScroll={checkScrollability}
        >
          {data.map((article) => (
            <div key={article.id} className="flex-none w-80">
              <ArticleCard
                article={{
                  ...article,
                  category: {
                    ...article.category,
                    name: "Top Pick",
                  },
                }}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
