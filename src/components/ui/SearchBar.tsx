
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react'; // Use Lucide icon

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSubmit'> {
  className?: string;
  inputClassName?: string;
  initialValue?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, inputClassName, initialValue = '', ...props }, ref) => {
    const [query, setQuery] = useState(initialValue);
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmedQuery = query.trim();
      if (trimmedQuery) {
        // Navigate to the search results page with the query
        router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      }
    };

    return (
      <form onSubmit={handleSubmit} className={cn("relative w-full", className)} role="search">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        </div>
        <input
          ref={ref}
          type="search" // Use type="search" for better semantics and potential browser UI
          name="q" // Add name attribute
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "block w-full p-2 pl-10 text-sm rounded-md",
            "text-dark dark:text-white",
            "bg-light dark:bg-darkMode-bg",
            "border border-medium dark:border-gray-600",
            "focus:ring-primary focus:border-primary focus:outline-none",
            "placeholder:text-gray-500 dark:placeholder:text-gray-400",
            inputClassName
          )}
          placeholder="Search articles..."
          aria-label="Search articles"
          {...props}
        />
        <button type="submit" className="sr-only">
          Submit Search
        </button>
      </form>
    );
  }
);

SearchBar.displayName = 'SearchBar';

