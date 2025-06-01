"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Article,
  ArticleCard,
} from "@/components/features/articles/ArticleCard";

interface TopPicksSectionProps {
  articles: Article[];
}

export const TopPicksSection: React.FC<TopPicksSectionProps> = ({
  articles,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll possibilities when component mounts or articles change
  useEffect(() => {
    checkScrollability();
    // Add resize listener to recheck scrollability when window size changes
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, [articles]);

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
          {articles.map((article) => (
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
