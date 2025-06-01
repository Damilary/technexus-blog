import React from 'react';
import { HeroSection } from '@/components/features/home/HeroSection';
import { FeaturedArticlesSection } from '@/components/features/home/FeaturedArticlesSection';
import { CategoryShowcaseSection } from '@/components/features/home/CategoryShowcaseSection';
import { TopPicksSection } from '@/components/features/home/TopPicksSection';
import { NewsletterSection } from '@/components/features/home/NewsletterSection';
import { LatestArticlesSection } from '@/components/features/home/LatestArticlesSection';

// Sample data for the homepage sections
const heroArticle = {
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

const featuredArticles = [
  {
    id: '2',
    title: 'Web3 Development: Building the Decentralized Future',
    excerpt: 'A comprehensive guide to developing applications for the decentralized web using blockchain technology and smart contracts.',
    slug: 'web3-development-guide',
    coverImage: '/images/placeholder-1.jpg',
    category: {
      name: 'Web Development',
      slug: 'web-development'
    },
    publishedAt: '2025-05-19T10:30:00Z',
    author: {
      name: 'Michael Chen',
      avatar: '/images/authors/michael-chen.jpg'
    },
    readingTime: '8 min read'
  },
  {
    id: '3',
    title: 'Quantum Computing: Practical Applications for Today\'s Businesses',
    excerpt: 'Discover how quantum computing is moving from theoretical research to practical business applications that can solve complex problems.',
    slug: 'quantum-computing-business-applications',
    coverImage: '/images/placeholder-2.jpg',
    category: {
      name: 'Emerging Tech',
      slug: 'emerging-tech'
    },
    publishedAt: '2025-05-18T14:15:00Z',
    author: {
      name: 'Priya Sharma',
      avatar: '/images/authors/priya-sharma.jpg'
    },
    readingTime: '12 min read'
  },
  {
    id: '4',
    title: 'Cybersecurity in the Age of AI: New Threats and Defenses',
    excerpt: 'How artificial intelligence is changing the cybersecurity landscape, creating new vulnerabilities while also providing powerful defensive tools.',
    slug: 'cybersecurity-ai-threats-defenses',
    coverImage: '/images/placeholder-3.jpg',
    category: {
      name: 'Cybersecurity',
      slug: 'cybersecurity'
    },
    publishedAt: '2025-05-17T09:45:00Z',
    author: {
      name: 'James Wilson',
      avatar: '/images/authors/james-wilson.jpg'
    },
    readingTime: '10 min read'
  }
];

const webDevArticles = [
  {
    id: '5',
    title: 'Next.js 15: What\'s New and Improved',
    excerpt: 'Exploring the latest features in Next.js 15 and how they can enhance your web development workflow.',
    slug: 'nextjs-15-new-features',
    coverImage: '/images/placeholder-4.jpg',
    category: {
      name: 'Web Development',
      slug: 'web-development'
    },
    publishedAt: '2025-05-16T11:20:00Z',
    author: {
      name: 'Alex Rodriguez',
      avatar: '/images/authors/alex-rodriguez.jpg'
    },
    readingTime: '6 min read'
  },
  {
    id: '6',
    title: 'CSS Architecture for Large-Scale Applications',
    excerpt: 'Best practices for organizing CSS in large applications to maintain scalability and performance.',
    slug: 'css-architecture-large-applications',
    coverImage: '/images/placeholder-5.jpg',
    category: {
      name: 'Web Development',
      slug: 'web-development'
    },
    publishedAt: '2025-05-15T13:10:00Z',
    author: {
      name: 'Emma Thompson',
      avatar: '/images/authors/emma-thompson.jpg'
    },
    readingTime: '9 min read'
  },
  {
    id: '7',
    title: 'Building Accessible Web Applications',
    excerpt: 'A comprehensive guide to ensuring your web applications are accessible to all users, including those with disabilities.',
    slug: 'building-accessible-web-applications',
    coverImage: '/images/placeholder-6.jpg',
    category: {
      name: 'Web Development',
      slug: 'web-development'
    },
    publishedAt: '2025-05-14T15:30:00Z',
    author: {
      name: 'David Kim',
      avatar: '/images/authors/david-kim.jpg'
    },
    readingTime: '11 min read'
  },
  {
    id: '8',
    title: 'API Design Principles for Modern Web Applications',
    excerpt: 'Learn how to design robust and scalable APIs that power modern web applications.',
    slug: 'api-design-principles',
    coverImage: '/images/placeholder-7.jpg',
    category: {
      name: 'Web Development',
      slug: 'web-development'
    },
    publishedAt: '2025-05-13T10:45:00Z',
    author: {
      name: 'Sophia Martinez',
      avatar: '/images/authors/sophia-martinez.jpg'
    },
    readingTime: '8 min read'
  }
];

const topPicksArticles = [
  {
    id: '9',
    title: 'The Rise of Edge Computing in IoT Ecosystems',
    excerpt: 'How edge computing is transforming IoT implementations by processing data closer to the source.',
    slug: 'edge-computing-iot-ecosystems',
    coverImage: '/images/placeholder-8.jpg',
    category: {
      name: 'IoT',
      slug: 'iot'
    },
    publishedAt: '2025-05-12T09:15:00Z',
    author: {
      name: 'Thomas Anderson',
      avatar: '/images/authors/thomas-anderson.jpg'
    },
    readingTime: '7 min read'
  },
  {
    id: '10',
    title: 'Machine Learning for Predictive Maintenance',
    excerpt: 'Implementing machine learning models to predict equipment failures before they happen.',
    slug: 'machine-learning-predictive-maintenance',
    coverImage: '/images/placeholder-9.jpg',
    category: {
      name: 'AI & Machine Learning',
      slug: 'ai-ml'
    },
    publishedAt: '2025-05-11T14:20:00Z',
    author: {
      name: 'Olivia Wang',
      avatar: '/images/authors/olivia-wang.jpg'
    },
    readingTime: '9 min read'
  },
  {
    id: '11',
    title: 'Blockchain Beyond Cryptocurrency',
    excerpt: 'Exploring practical applications of blockchain technology in supply chain, healthcare, and more.',
    slug: 'blockchain-beyond-cryptocurrency',
    coverImage: '/images/placeholder-10.jpg',
    category: {
      name: 'Blockchain',
      slug: 'blockchain'
    },
    publishedAt: '2025-05-10T11:30:00Z',
    author: {
      name: 'Robert Johnson',
      avatar: '/images/authors/robert-johnson.jpg'
    },
    readingTime: '10 min read'
  },
  {
    id: '12',
    title: 'The Psychology of UX Design',
    excerpt: 'Understanding human psychology to create more intuitive and engaging user experiences.',
    slug: 'psychology-of-ux-design',
    coverImage: '/images/placeholder-11.jpg',
    category: {
      name: 'UX Design',
      slug: 'ux-design'
    },
    publishedAt: '2025-05-09T10:15:00Z',
    author: {
      name: 'Natalie Brown',
      avatar: '/images/authors/natalie-brown.jpg'
    },
    readingTime: '8 min read'
  },
  {
    id: '13',
    title: 'Serverless Architecture: Benefits and Challenges',
    excerpt: 'A deep dive into serverless computing, its advantages, and the challenges of implementation.',
    slug: 'serverless-architecture-benefits-challenges',
    coverImage: '/images/placeholder-12.jpg',
    category: {
      name: 'Cloud Computing',
      slug: 'cloud-computing'
    },
    publishedAt: '2025-05-08T13:45:00Z',
    author: {
      name: 'Daniel Lee',
      avatar: '/images/authors/daniel-lee.jpg'
    },
    readingTime: '11 min read'
  }
];

const latestArticles = [
  ...featuredArticles.slice(0, 2),
  ...webDevArticles.slice(0, 2),
  ...topPicksArticles.slice(0, 2),
  {
    id: '14',
    title: 'Augmented Reality in Retail: Enhancing the Shopping Experience',
    excerpt: 'How retailers are using AR to create immersive shopping experiences both online and in-store.',
    slug: 'augmented-reality-retail',
    coverImage: '/images/placeholder-13.jpg',
    category: {
      name: 'AR/VR',
      slug: 'ar-vr'
    },
    publishedAt: '2025-05-07T09:30:00Z',
    author: {
      name: 'Jennifer Park',
      avatar: '/images/authors/jennifer-park.jpg'
    },
    readingTime: '7 min read'
  },
  {
    id: '15',
    title: 'The Future of Remote Work Technologies',
    excerpt: 'Exploring the tools and technologies that will shape the future of distributed teams and remote collaboration.',
    slug: 'future-remote-work-technologies',
    coverImage: '/images/placeholder-14.jpg',
    category: {
      name: 'Workplace Tech',
      slug: 'workplace-tech'
    },
    publishedAt: '2025-05-06T14:10:00Z',
    author: {
      name: 'Marcus Johnson',
      avatar: '/images/authors/marcus-johnson.jpg'
    },
    readingTime: '9 min read'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection article={heroArticle} />
      <FeaturedArticlesSection articles={featuredArticles} />
      <CategoryShowcaseSection 
        title="Latest in Web Development" 
        categorySlug="web-development"
        articles={webDevArticles}
      />
      <TopPicksSection articles={topPicksArticles} />
      <NewsletterSection />
      <LatestArticlesSection articles={latestArticles} />
    </div>
  );
}
