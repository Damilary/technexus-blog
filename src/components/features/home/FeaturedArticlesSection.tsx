import React from 'react';
import { ArticleCard, Article } from '@/components/features/articles/ArticleCard';

interface FeaturedArticlesSectionProps {
  articles: Article[];
  title?: string;
}

export const FeaturedArticlesSection: React.FC<FeaturedArticlesSectionProps> = ({ 
  articles,
  title = "Featured Articles" 
}) => {
  return (
    <section className="py-12 bg-white dark:bg-darkMode-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-dark dark:text-white mb-8">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              variant={articles.length <= 3 ? "featured" : "default"}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
