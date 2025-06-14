import type { Article, User, Comment, Tag } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://i.pravatar.cc/150?u=john',
    bio: 'Senior Developer at TechNexus',
    role: 'ADMIN',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2023-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: 'https://i.pravatar.cc/150?u=jane',
    bio: 'UX Designer and Tech Writer',
    role: 'USER',
    createdAt: '2023-02-20T14:30:00Z',
    updatedAt: '2023-02-20T14:30:00Z',
  },
  {
    id: '3',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    image: 'https://i.pravatar.cc/150?u=alex',
    bio: 'Full Stack Developer and AI Enthusiast',
    role: 'USER',
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-03-10T09:15:00Z',
  },
];

// Mock Tags
export const mockTags: Tag[] = [
  { id: '1', name: 'JavaScript', slug: 'javascript' },
  { id: '2', name: 'React', slug: 'react' },
  { id: '3', name: 'Next.js', slug: 'nextjs' },
  { id: '4', name: 'TypeScript', slug: 'typescript' },
  { id: '5', name: 'GraphQL', slug: 'graphql' },
  { id: '6', name: 'Web Development', slug: 'web-development' },
  { id: '7', name: 'AI', slug: 'ai' },
  { id: '8', name: 'Machine Learning', slug: 'machine-learning' },
];

// Helper function to generate lorem ipsum text
const generateLoremIpsum = (paragraphs: number): string => {
  const lorem = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet nunc, quis aliquam nisl nunc eu nisl.',
    'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.',
    'Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui.',
    'Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.',
  ];
  
  const result = [];
  for (let i = 0; i < paragraphs; i++) {
    result.push(lorem[i % lorem.length]);
  }
  
  return result.join('\n\n');
};

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Great article! This helped me understand the concept better.',
    createdAt: '2023-04-05T16:45:00Z',
    updatedAt: '2023-04-05T16:45:00Z',
    author: mockUsers[0],
    article: {} as Article, // Will be populated later
  },
  {
    id: '2',
    content: 'I have a question about the implementation. Would this work with TypeScript?',
    createdAt: '2023-04-06T10:20:00Z',
    updatedAt: '2023-04-06T10:20:00Z',
    author: mockUsers[1],
    article: {} as Article, // Will be populated later
  },
  {
    id: '3',
    content: 'Thanks for sharing this knowledge. Looking forward to more content like this!',
    createdAt: '2023-04-07T14:10:00Z',
    updatedAt: '2023-04-07T14:10:00Z',
    author: mockUsers[2],
    article: {} as Article, // Will be populated later
  },
];

// Mock Articles
export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Getting Started with Next.js 15',
    content: generateLoremIpsum(6),
    excerpt: 'Learn how to build modern web applications with Next.js 15, the latest version of the popular React framework.',
    slug: 'getting-started-with-nextjs-15',
    publishedAt: '2023-04-01T09:00:00Z',
    updatedAt: '2023-04-02T11:30:00Z',
    author: mockUsers[0],
    tags: [mockTags[2], mockTags[1], mockTags[5]],
    comments: [mockComments[0]],
  },
  {
    id: '2',
    title: 'Understanding TypeScript Generic Types',
    content: generateLoremIpsum(5),
    excerpt: 'Dive deep into TypeScript generic types and learn how to use them effectively in your projects.',
    slug: 'understanding-typescript-generic-types',
    publishedAt: '2023-04-03T14:20:00Z',
    updatedAt: '2023-04-03T14:20:00Z',
    author: mockUsers[1],
    tags: [mockTags[3], mockTags[0], mockTags[5]],
    comments: [mockComments[1]],
  },
  {
    id: '3',
    title: 'Building a GraphQL API with Apollo Server',
    content: generateLoremIpsum(7),
    excerpt: 'Learn how to create a robust GraphQL API using Apollo Server, with authentication and error handling.',
    slug: 'building-graphql-api-apollo-server',
    publishedAt: '2023-04-05T10:15:00Z',
    updatedAt: '2023-04-06T09:45:00Z',
    author: mockUsers[2],
    tags: [mockTags[4], mockTags[0], mockTags[5]],
    comments: [mockComments[2]],
  },
  {
    id: '4',
    title: 'React 19 New Features Overview',
    content: generateLoremIpsum(6),
    excerpt: 'Explore the exciting new features in React 19 and how they can improve your development workflow.',
    slug: 'react-19-new-features-overview',
    publishedAt: '2023-04-08T13:00:00Z',
    updatedAt: '2023-04-08T13:00:00Z',
    author: mockUsers[0],
    tags: [mockTags[1], mockTags[0], mockTags[5]],
    comments: [],
  },
  {
    id: '5',
    title: 'Machine Learning for Web Developers',
    content: generateLoremIpsum(8),
    excerpt: 'Introduction to machine learning concepts for web developers, with practical examples using TensorFlow.js.',
    slug: 'machine-learning-for-web-developers',
    publishedAt: '2023-04-10T11:30:00Z',
    updatedAt: '2023-04-11T15:20:00Z',
    author: mockUsers[1],
    tags: [mockTags[6], mockTags[7], mockTags[0]],
    comments: [],
  },
];

// Populate article references in comments
mockComments[0].article = mockArticles[0];
mockComments[1].article = mockArticles[1];
mockComments[2].article = mockArticles[2]; 