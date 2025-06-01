// src/lib/api/mockData.ts
import { HeroArticle } from '@/components/features/home/HeroSection';

// Mock data for the hero article
export const mockHeroArticle: HeroArticle = {
  id: '1',
  title: 'The Future of AI: Transforming Industries in 2025 and Beyond',
  excerpt: 'Explore how artificial intelligence is revolutionizing everything from healthcare to finance, and what this means for businesses and consumers alike.',
  slug: 'future-of-ai-2025',
  coverImage: '/images/placeholder-hero.jpg',
  category: {
    name: 'AI & Machine Learning',
    slug: 'ai-ml'
  },
  publishedAt: '2025-05-20T08:00:00Z',
  author: {
    name: 'Sarah Johnson',
    role: 'AI Research Lead',
    avatar: '/images/authors/sarah-johnson.jpg'
  }
};

// Mock handler for GraphQL requests
export const mockGraphQLHandler = async (query: string, variables?: any) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check which query is being made and return appropriate mock data
  if (query.includes('heroArticle')) {
    return { heroArticle: mockHeroArticle };
  }
  
  // Default fallback
  return { error: 'Query not implemented in mock handler' };
};
