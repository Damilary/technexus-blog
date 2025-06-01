// backend/src/graphql/typeDefs.ts
import { gql } from "apollo-server-express";

export const typeDefs = gql`
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
    excerpt: String!
    content: String!
    coverImage: String
    category: Category!
    tags: [Tag!]
    author: User!
    publishedAt: String!
    readingTime: String!
    expertiseLevel: ExpertiseLevel!
    viewCount: Int!
    createdAt: String!
    updatedAt: String!
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
    excerpt: String!
    content: String!
    coverImage: String
    categoryId: ID!
    tagIds: [ID!]
    expertiseLevel: ExpertiseLevel!
  }

  input CreateUserInput {
    email: String!
    password: String!
    name: String
    role: UserRole = USER
  }
`;
