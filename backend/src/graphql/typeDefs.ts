// backend/src/graphql/typeDefs.ts
import { gql } from "apollo-server-express";

export const typeDefs = gql`
  scalar JSON # Added JSON scalar

  type User {
    id: ID!
    name: String!
    email: String!
    name: String
    role: UserRole!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Avatar {
    id: ID!
    url: String!
    createdAt: String!
    updatedAt: String!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
  }

  type Article {
    id: ID!
    title: String!
    slug: String!
    excerpt: String # Optional as per typical usage
    # content: String! # Original - will be changed to content: String
    coverImage: String
    # category: Category! # Assuming relation, might be complex for direct input
    # tags: [Tag!] # Assuming relation
    author: User! # Assuming relation, authorId will be in input or context
    publishedDate: String # Or DateTime
    updatedDate: String! # Or DateTime
    readTimeMinutes: Int
    isFeatured: Boolean!
    isPublished: Boolean!
    isTopPick: Boolean!
    topPickOrder: Int
    authorId: String! # Added to match subtask example structure
    primaryCategoryId: String # Added to match subtask example structure
    content: String # Made optional for Markdown content
    blocks: JSON # For block-based editor content
  }

  enum ExpertiseLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  enum UserRole {
    USER
    CONTRIBUTOR
    EDITOR
    ADMIN
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    articles(limit: Int, offset: Int): [Article!]!
    article(slug: String!): Article
    categories: [Category!]!
    category(slug: String!): Category
    tags: [Tag!]!
    tag(slug: String!): Tag
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): AuthPayload!
    signup(name: String!, email: String!, password: String!): AuthPayload!
    createArticle(input: ArticleInput!): Article!
    updateArticle(id: ID!, input: ArticleInput!): Article!
    deleteArticle(id: ID!): Boolean!
    signup(input: CreateUserInput!): AuthPayload!
    updateUserRole(userId: ID!, role: UserRole!): User!
  }

  input ArticleInput {
    title: String!
    slug: String! # Added slug as it's usually required
    excerpt: String # Optional
    publishedDate: String # Optional
    isFeatured: Boolean # Optional
    isPublished: Boolean # Optional
    isTopPick: Boolean # Optional
    topPickOrder: Int # Optional
    primaryCategoryId: String # Optional
    # categoryId: ID! # Replaced by primaryCategoryId to match Article type
    # tagIds: [ID!] # Assuming tags are handled differently or as separate relation mutations
    # coverImage: String # Already present in Article, should be here too
    # expertiseLevel: ExpertiseLevel! # Already present in Article, should be here too
    content: String # Optional new field
    blocks: JSON # Optional new field
  }

  input CreateUserInput {
    email: String!
    password: String!
    name: String
    role: UserRole = USER
  }
`;
