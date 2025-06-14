export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt: string;
  author: User;
  tags: Tag[];
  comments: Comment[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  article: Article;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

// GraphQL Operation Types
export interface GraphQLOperation<T, V = Record<string, unknown>> {
  query: string;
  variables?: V;
  response: T;
}
