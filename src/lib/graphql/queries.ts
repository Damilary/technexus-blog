// src/lib/graphql/queries.ts
import { gql } from 'graphql-request';

// Fragment for consistent article data structure
export const ARTICLE_FRAGMENT = gql`
  fragment ArticleFields on Article {
    id
    title
    excerpt
    slug
    coverImage
    publishedAt
    readingTime
    category {
      name
      slug
    }
    author {
      name
      role
      avatar
    }
  }
`;

// Query to fetch the hero/featured article
export const GET_HERO_ARTICLE = gql`
  query GetHeroArticle {
    heroArticle {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

// Query to fetch featured articles
export const GET_FEATURED_ARTICLES = gql`
  query GetFeaturedArticles($limit: Int = 3) {
    featuredArticles(limit: $limit) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

// Query to fetch articles by category
export const GET_ARTICLES_BY_CATEGORY = gql`
  query GetArticlesByCategory($slug: String!, $limit: Int = 4) {
    articlesByCategory(slug: $slug, limit: $limit) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

// Query to fetch top picks articles
export const GET_TOP_PICKS = gql`
  query GetTopPicks($limit: Int = 5) {
    topPicks(limit: $limit) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

// Query to fetch latest articles
export const GET_LATEST_ARTICLES = gql`
  query GetLatestArticles($limit: Int = 6, $offset: Int = 0) {
    latestArticles(limit: $limit, offset: $offset) {
      ...ArticleFields
    }
    totalArticlesCount
  }
  ${ARTICLE_FRAGMENT}
`;
