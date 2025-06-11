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
    role?: string; // Added role here as it exists in mockHeroArticle
  };
  readingTime?: string;
  tags?: string[]; // Added tags for filtering
}

// Interface for HeroArticle specifically, if it has extra fields
export interface HeroArticle extends Article {
  // Add any fields specific to HeroArticle if they exist
  // For now, it uses the base Article fields
}

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured' | 'list'; // Added list variant
  className?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  variant = 'default',
  className = ''
}) => {
  // Base styling
  const baseClasses = "bg-white dark:bg-dark rounded-lg overflow-hidden shadow-md transition-shadow hover:shadow-lg";
  
  // Variant-specific styling
  let containerClasses = baseClasses;
  let imageContainerHeight = 'h-48';
  let contentPadding = 'p-5';
  let titleSize = 'text-xl';
  let showExcerpt = true;

  if (variant === 'compact') {
    imageContainerHeight = 'h-40';
    contentPadding = 'p-4';
    titleSize = 'text-lg';
    showExcerpt = false;
  } else if (variant === 'featured') {
    titleSize = 'text-xl md:text-2xl';
  } else if (variant === 'list') {
    // List variant: Horizontal layout, smaller image
    containerClasses = `${baseClasses} flex flex-col md:flex-row`;
    imageContainerHeight = 'h-40 md:h-full'; // Adjust height for list view
    contentPadding = 'p-4 md:p-5';
    titleSize = 'text-lg md:text-xl';
    showExcerpt = true; // Show excerpt in list view
  }

  return (
    <article className={`${containerClasses} ${className}`}>
      {/* Article Image (adjust width for list view) */}
      <Link href={`/articles/${article.slug}`} className={`block relative ${variant === 'list' ? 'md:w-1/3 flex-shrink-0' : ''}`}>
        <div className={`relative ${imageContainerHeight} bg-light-dark`}>
          {article.coverImage ? (
            <Image 
              src={article.coverImage}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Add sizes prop
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
      <div className={`${contentPadding} ${variant === 'list' ? 'md:w-2/3' : ''} flex flex-col justify-between`}>
        <div> {/* Top content group */} 
          <div className="flex items-center mb-2 md:mb-3 flex-wrap">
            <Link 
              href={`/categories/${article.category.slug}`}
              className="bg-secondary text-white text-xs font-medium px-2.5 py-0.5 rounded hover:bg-secondary-hover transition-colors mr-2 mb-1"
            >
              {article.category.name}
            </Link>
            <time className="text-medium text-xs md:text-sm mr-2 mb-1" dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short', // Use short month for space
                day: 'numeric'
              })}
            </time>
            {article.readingTime && (
              <span className="text-xs text-medium mb-1">
                · {article.readingTime}
              </span>
            )}
          </div>
          
          <Link href={`/articles/${article.slug}`} className="block group mb-2 md:mb-3">
            <h3 className={`font-semibold text-dark dark:text-white group-hover:text-primary transition-colors ${titleSize}`}>
              {article.title}
            </h3>
          </Link>
          
          {showExcerpt && (
            <p className="text-dark-light dark:text-medium-light text-sm mb-3 md:mb-4 line-clamp-2 md:line-clamp-3">
              {article.excerpt}
            </p>
          )}
        </div>

        <div> {/* Bottom content group */} 
          {/* Display Tags if they exist */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {article.author.avatar ? (
                <Image 
                  src={article.author.avatar}
                  alt={article.author.name}
                  width={24} // Smaller avatar for card
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center font-medium text-xs">
                  {article.author.name.charAt(0)}
                </div>
              )}
              <span className="ml-2 text-sm text-medium">{article.author.name}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
