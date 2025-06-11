import { useState, useEffect } from 'react';
import FeaturedArticle from '../components/home/FeaturedArticle';
import ArticleGrid from '../components/home/ArticleGrid';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { articles } from '../data/articles';

function HomePage() {
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [latestArticles, setLatestArticles] = useState([]);
  const [aiArticles, setAiArticles] = useState([]);
  const [webDevArticles, setWebDevArticles] = useState([]);
  
  useEffect(() => {
    // Get the featured article (first article marked as featured)
    const featured = articles.find(article => article.featured);
    setFeaturedArticle(featured);
    
    // Latest articles (excluding the featured one)
    const latest = articles
      .filter(article => article.id !== featured?.id)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, 6);
    setLatestArticles(latest);
    
    // AI & ML category articles
    const ai = articles
      .filter(article => article.category === 'AI & Machine Learning')
      .slice(0, 3);
    setAiArticles(ai);
    
    // Web Development category articles
    const webDev = articles
      .filter(article => article.category === 'Web Development')
      .slice(0, 3);
    setWebDevArticles(webDev);
  }, []);
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            The Home of Tech Insights
          </h1>
          <p className="text-xl text-medium max-w-3xl mx-auto">
            Expert-driven technology insights for developers, tech enthusiasts, and decision-makers.
          </p>
        </div>
        
        {/* Featured article */}
        {featuredArticle && (
          <FeaturedArticle article={featuredArticle} />
        )}
      </section>
      
      {/* Latest articles */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-dark">Latest Articles</h2>
          <Button variant="tertiary" to="/category/latest">
            View all
          </Button>
        </div>
        
        <ArticleGrid articles={latestArticles} columns={3} />
      </section>
      
      {/* Categories sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* AI & Machine Learning */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark">AI & Machine Learning</h2>
            <Button variant="tertiary" to="/category/ai-ml" size="sm">
              More articles
            </Button>
          </div>
          
          <div className="space-y-6">
            {aiArticles.map(article => (
              <Card 
                key={article.id} 
                article={article} 
                imagePosition="left"
                showExcerpt={false}
              />
            ))}
          </div>
        </section>
        
        {/* Web Development */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-dark">Web Development</h2>
            <Button variant="tertiary" to="/category/web-dev" size="sm">
              More articles
            </Button>
          </div>
          
          <div className="space-y-6">
            {webDevArticles.map(article => (
              <Card 
                key={article.id} 
                article={article} 
                imagePosition="left"
                showExcerpt={false}
              />
            ))}
          </div>
        </section>
      </div>
      
      {/* Newsletter */}
      <section className="bg-primary-lighter rounded-lg p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-dark mb-4">
            Stay Updated with Tech Trends
          </h2>
          <p className="text-medium mb-6">
            Subscribe to our newsletter to receive the latest insights directly in your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-dark shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
            <Button variant="primary">
              Subscribe
            </Button>
          </div>
          
          <p className="text-xs text-medium mt-3">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;