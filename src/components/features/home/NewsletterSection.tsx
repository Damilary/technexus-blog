'use client';

import React, { useState } from 'react';

interface NewsletterSectionProps {
  backgroundImage?: string;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ 
  backgroundImage 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setIsSubmitting(true);
    
    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className={`py-12 bg-primary text-white ${backgroundImage ? 'bg-cover bg-center' : ''}`}
      style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with TechNexus</h2>
            <p className="mb-6">
              Subscribe to our newsletter and get the latest tech news, tutorials, and insights delivered directly to your inbox.
            </p>
            
            {isSuccess ? (
              <div className="bg-white bg-opacity-20 p-4 rounded-md">
                <p className="font-medium">Thank you for subscribing!</p>
                <p className="text-sm mt-1">You'll start receiving our newsletter soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-grow">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-md text-dark focus:outline-none focus:ring-2 focus:ring-white"
                      disabled={isSubmitting}
                    />
                    {error && (
                      <p className="mt-1 text-sm text-white bg-error bg-opacity-70 px-2 py-1 rounded">
                        {error}
                      </p>
                    )}
                  </div>
                  <button 
                    type="submit"
                    className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-3 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                <p className="text-sm opacity-80">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>
            )}
          </div>
          
          <div className="hidden lg:flex justify-center">
            <div className="w-80 h-80 bg-primary-hover rounded-full flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-32 w-32 text-white opacity-80" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
