import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon, BookmarkIcon, ShareIcon } from '@heroicons/react/24/outline';
import { articles } from '../data/articles';
import Button from '../components/common/Button';
import ArticleGrid from '../components/home/ArticleGrid';

function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, this would be an API fetch
    const fetchedArticle = articles.find((a) => a.slug === slug);
    
    if (fetchedArticle) {
      setArticle(fetchedArticle);
      
      // Get related articles (same category, excluding current)
      const related = articles
        .filter((a) => a.category === fetchedArticle.category && a.id !== fetchedArticle.id)
        .slice(0, 3);
      
      setRelatedArticles(related);
    }
    
    setIsLoading(false);
    
    // Scroll to top when article changes
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-dark mb-4">Article Not Found</h1>
        <p className="mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Button to="/">Back to Home</Button>
      </div>
    );
  }

  const {
    title,
    coverImage,
    category,
    publishedAt,
    readingTime,
    content,
    author,
    tags,
  } = article;

  const formattedDate = format(new Date(publishedAt), 'MMMM d, yyyy');

  return (
    <div className="bg-light-lighter">
      {/* Article Header */}
      <div className="bg-white border-b border-light-dark">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link 
              to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              {category}
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-6">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 md:gap-6 text-medium mb-8">
            <div className="flex items-center">
              {author.avatar && (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
              )}
              <div>
                <p className="font-medium text-dark">{author.name}</p>
                {author.title && (
                  <p className="text-sm">{author.title}</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-1 text-medium-light" />
                <span className="text-sm">{formattedDate}</span>
              </div>
              
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-1 text-medium-light" />
                <span className="text-sm">{readingTime} min read</span>
              </div>
            </div>
          </div>
          
          {/* Article Actions */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center"
            >
              <BookmarkIcon className="h-4 w-4 mr-1" />
              Save
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center"
            >
              <ShareIcon className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Article Hero Image */}
      <div className="w-full bg-dark">
        <div className="max-w-5xl mx-auto">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-10">
          <div className="prose prose-lg max-w-none">
            {/* Article content would normally be rendered from Markdown/HTML */}
            {content.map((paragraph, index) => (
              <p key={index} className={index !== content.length - 1 ? "mb-6" : ""}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-light-dark">
              <h3 className="text-sm font-medium text-medium mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link 
                    key={tag}
                    to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-light text-dark hover:bg-light-dark px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-12 pt-6 border-t border-light-dark">
            <div className="flex items-start sm:items-center">
              {author.avatar && (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
              )}
              <div>
                <h3 className="font-medium text-lg text-dark">
                  {author.name}
                </h3>
                {author.bio && (
                  <p className="text-medium mt-1">
                    {author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <ArticleGrid 
            articles={relatedArticles} 
            title="Related Articles" 
            description="You might also be interested in these articles"
            columns={3}
          />
        </div>
      )}

      {/* Newsletter CTA */}
      <div className="bg-primary-lighter">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-dark mb-4">
              Want more tech insights?
            </h2>
            <p className="text-medium mb-8 max-w-2xl mx-auto">
              Join our newsletter and get the latest tech insights delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-dark shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              />
              <Button variant="primary">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticlePage;