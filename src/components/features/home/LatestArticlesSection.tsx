import React from 'react';
import { ArticleCard, Article } from '@/components/features/articles/ArticleCard';

interface LatestArticlesSectionProps {
  articles: Article[];
  initialDisplayCount?: number;
}

export const LatestArticlesSection: React.FC<LatestArticlesSectionProps> = ({ 
  articles,
  initialDisplayCount = 6
}) => {
  // In a real implementation, this would use React state and load more functionality
  // For now, we'll just display the initial count of articles
  const displayedArticles = articles.slice(0, initialDisplayCount);
  
  return (
    <section className="py-12 bg-light dark:bg-darkMode-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-8">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article}
            />
          ))}
        </div>
        
        {articles.length > initialDisplayCount && (
          <div className="mt-10 flex justify-center">
            <button className="bg-primary hover:bg-primary-hover text-white font-medium px-6 py-3 rounded-md transition-colors">
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
