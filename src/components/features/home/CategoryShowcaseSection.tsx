import React from 'react';
import Link from 'next/link';
import { ArticleCard, Article } from '@/components/features/articles/ArticleCard';

interface CategoryShowcaseSectionProps {
  title: string;
  categorySlug: string;
  articles: Article[];
}

export const CategoryShowcaseSection: React.FC<CategoryShowcaseSectionProps> = ({
  title,
  categorySlug,
  articles
}) => {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              variant="compact"
            />
          ))}
        </div>
      </div>
    </section>
  );
};
