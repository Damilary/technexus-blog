import React from 'react';

export interface Article {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  excerpt: string;
  coverImage: {
    url: string;
  };
  author: {
    name: string;
    picture: string;
  };
  categories: {
    name: string;
    slug: string;
  }[];
}

interface ArticleCardProps {
  article: Article;
  variant?: 'standard' | 'featured' | 'top-pick' | 'compact' | 'default';
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'standard', className }) => {
  const baseClasses = 'border rounded-lg overflow-hidden shadow-sm';
  const variantClasses = {
    standard: 'flex flex-col',
    featured: 'flex flex-col md:flex-row',
    'top-pick': 'flex flex-col',
    compact: 'flex items-center space-x-4',
    default: 'flex flex-col', // Assuming 'default' is similar to 'standard'
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant || 'standard']} ${className || ''}`}>
      {/* Add actual content based on variant */}
      <h3>{article.title}</h3>
      <p>{article.excerpt}</p>
      {/* ... rest of the component */}
    </div>
  );
};
