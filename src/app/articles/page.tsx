'use client';

import { useEffect } from 'react';
import { useArticles } from '@/hooks/useArticles';
import { cn } from '@/lib/utils';

export default function ArticlesPage() {
  const {
    articles,
    loading,
    error,
    hasMore,
    fetchArticles,
    loadMore,
  } = useArticles();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Articles</h1>

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-lg">
          {error.message}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.id}
            className={cn(
              'p-6 bg-white rounded-lg shadow-sm',
              'hover:shadow-md transition-shadow'
            )}
          >
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600 mb-4">{article.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{article.author.name}</span>
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString()}
              </time>
            </div>
          </article>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
} 