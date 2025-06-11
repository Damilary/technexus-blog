
'use client';

import React, { useState } from 'react';
import { useSubscribeNewsletter } from '@/hooks/useSubscribeNewsletter';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterSectionProps {
  backgroundImage?: string;
  variant?: 'default' | 'compact'; // Add variant prop
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({ 
  backgroundImage,
  variant = 'default' // Default to 'default' variant
}) => {
  const [email, setEmail] = useState('');
  const subscribeMutation = useSubscribeNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation (client-side)
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      subscribeMutation.reset();
      subscribeMutation.mutate({ email: '' }, { 
        onError: () => { /* Error state is set */ },
        onSuccess: () => { /* This won't be called */ }
      }); 
      return; 
    }
    
    subscribeMutation.mutate({ email }, {
      onSuccess: () => {
        setEmail(''); // Clear email field on success
      },
    });
  };

  // Common form elements
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className={`flex ${variant === 'compact' ? 'flex-col sm:flex-row' : 'flex-col sm:flex-row'} gap-3`}>
        <div className="flex-grow">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            // Adjust styling for compact variant if needed
            className={`w-full px-4 py-2.5 rounded-md text-dark dark:text-white bg-white dark:bg-darkMode-bg-secondary focus:outline-none focus:ring-2 ${variant === 'compact' ? 'focus:ring-primary' : 'focus:ring-white dark:focus:ring-primary'}`}
            disabled={subscribeMutation.isPending}
            aria-label="Email for newsletter"
            aria-describedby={subscribeMutation.error ? "newsletter-error" : undefined}
          />
          {subscribeMutation.error && (
            <div id="newsletter-error" className={`mt-2 text-sm ${variant === 'compact' ? 'text-red-400' : 'text-red-200 dark:text-red-300 bg-red-800 bg-opacity-50'} px-3 py-1 rounded-md flex items-center`}>
              <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
              {subscribeMutation.error instanceof Error ? subscribeMutation.error.message : 'An error occurred. Please try again.'}
            </div>
          )}
        </div>
        <button 
          type="submit"
          // Adjust styling for compact variant if needed
          className={`bg-accent hover:bg-accent-hover text-white font-medium px-5 py-2.5 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center ${variant === 'compact' ? 'w-full sm:w-auto' : ''}`}
          disabled={subscribeMutation.isPending}
        >
          {subscribeMutation.isPending ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Subscribing...
            </>
          ) : (
            'Subscribe'
          )}
        </button>
      </div>
      {variant === 'default' && (
        <p className="text-sm opacity-80">
          We respect your privacy. Unsubscribe at any time.
        </p>
      )}
    </form>
  );

  const renderSuccessMessage = () => (
    <div className={`border px-4 py-3 rounded-md flex items-center ${variant === 'compact' ? 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300' : 'bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300'}`}>
      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
      <div>
        <p className="font-medium">Thank you!</p>
        {variant === 'default' && (
          <p className="text-sm mt-1">You'll start receiving our newsletter soon.</p>
        )}
      </div>
    </div>
  );

  // Default variant structure
  if (variant === 'default') {
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
              {subscribeMutation.isSuccess ? renderSuccessMessage() : renderForm()}
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
  }

  // Compact variant structure (for footer)
  if (variant === 'compact') {
    return (
      <div>
        <h3 className="text-sm font-medium text-white uppercase tracking-wider mb-4">
          Subscribe to our Newsletter
        </h3>
        {subscribeMutation.isSuccess ? renderSuccessMessage() : renderForm()}
        <p className="text-xs text-medium-light mt-3">
          Get the latest updates directly in your inbox.
        </p>
      </div>
    );
  }

  return null; // Should not happen if variant is correctly typed
};

