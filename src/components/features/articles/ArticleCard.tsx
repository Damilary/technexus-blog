import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export interface Article {
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
    avatar?: string;
  };
  readingTime?: string;
}

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  variant = 'default',
  className = ''
}) => {
  return (
    <article className={`bg-white dark:bg-dark rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-lg ${className}`}>
      {/* Article Image */}
      <Link href={`/articles/${article.slug}`} className="block relative">
        <div className={`relative ${variant === 'compact' ? 'h-40' : 'h-48'} bg-light-dark`}>
          {article.coverImage ? (
            <Image 
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-dark dark:text-white">
              No Image Available
            </div>
          )}
        </div>
      </Link>
      
      {/* Article Content */}
      <div className={`p-5 ${variant === 'compact' ? 'p-4' : 'p-5'}`}>
        <div className="flex items-center mb-3">
          <Link 
            href={`/categories/${article.category.slug}`}
            className="bg-secondary text-white text-xs font-medium px-2.5 py-0.5 rounded hover:bg-secondary-hover transition-colors"
          >
            {article.category.name}
          </Link>
          <time className="ml-2 text-medium text-sm" dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>
        
        <Link href={`/articles/${article.slug}`} className="block group">
          <h3 className={`font-semibold text-dark dark:text-white mb-2 group-hover:text-primary transition-colors ${
            variant === 'featured' ? 'text-xl md:text-2xl' : variant === 'compact' ? 'text-lg' : 'text-xl'
          }`}>
            {article.title}
          </h3>
        </Link>
        
        {variant !== 'compact' && (
          <p className="text-dark-light dark:text-medium-light mb-4">
            {article.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {article.author.avatar ? (
              <Image 
                src={article.author.avatar}
                alt={article.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-medium text-sm">
                {article.author.name.charAt(0)}
              </div>
            )}
            <span className="ml-2 text-sm text-medium">{article.author.name}</span>
          </div>
          
          {article.readingTime && (
            <span className="text-xs bg-light-dark dark:bg-medium px-2 py-1 rounded-full text-dark dark:text-white">
              {article.readingTime}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
