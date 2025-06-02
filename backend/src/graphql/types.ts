import { PrismaClient, User as PrismaUser } from "../generated/prisma"; // Import PrismaUser

// Define a "safe" User type for API responses, excluding sensitive fields like passwordHash
export enum UserRole {
  USER = "USER",
  CONTRIBUTOR = "CONTRIBUTOR",
  EDITOR = "EDITOR",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export interface Context {
  prisma: PrismaClient;
  user: User | null;
}

export interface ArticleInput {
  title: string;
  content: string; // In your class diagram, content is ContentBlock[]. Adjust if needed.
  slug: string; // Slugs are usually required and unique
  isPublished?: boolean;
  // Add other fields from your Article class diagram as needed for creation/update
}

export interface PaginationInput {
  limit?: number;
  offset?: number;
}

export interface AuthPayload {
  token: string;
  user: User; // Use the "safe" User type
}

export interface AuthenticatedUserContext {
  id: string;
  email: string;
  role: UserRole; // Make sure UserRole is correctly defined and imported
}
