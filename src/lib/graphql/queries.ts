// src/lib/graphql/queries.ts
import { gql } from 'graphql-request';

// Fragment for Author details (including bio)
export const AUTHOR_FRAGMENT = gql`
  fragment AuthorFields on Author {
    id
    name
    role
    avatar
    bio
  }
`;

// Fragment for Comment details
export const COMMENT_FRAGMENT = gql`
  fragment CommentFields on Comment {
    id
    content
    createdAt
    author {
      id
      name
      avatar
    }
  }
`;

// Fragment for User details
export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    name
    email
    avatar
    bio
  }
`;

// Fragment for User Preferences
export const USER_PREFERENCES_FRAGMENT = gql`
  fragment UserPreferencesFields on UserPreferences {
    id
    userId
    darkMode
    emailNotificationsEnabled
    favoriteCategories
    preferredLevel
    preferredFormats
  }
`;

// Fragment for consistent article data structure (basic for lists)
export const ARTICLE_FRAGMENT = gql`
  fragment ArticleFields on Article {
    id
    title
    excerpt
    slug
    coverImage
    publishedAt
    readingTime
    tags
    category {
      name
      slug
    }
    author {
      id # Use ID for linking
      name
      avatar
    }
  }
`;

// Fragment for detailed article data (including full content and detailed author)
export const ARTICLE_DETAIL_FRAGMENT = gql`
  fragment ArticleDetailFields on Article {
    id
    title
    slug
    coverImage
    publishedAt
    readingTime
    tags
    content # Assuming content is a string (e.g., Markdown) or structured data
    category {
      name
      slug
    }
    author {
      ...AuthorFields
    }
  }
  ${AUTHOR_FRAGMENT}
`;

// --- Queries --- //

export const GET_HERO_ARTICLE = gql`
  query GetHeroArticle {
    heroArticle {
      ...ArticleFields
      author {
        name
        role
        avatar
      }
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const GET_FEATURED_ARTICLES = gql`
  query GetFeaturedArticles($limit: Int = 3) {
    featuredArticles(limit: $limit) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const GET_ARTICLES_BY_CATEGORY_SHOWCASE = gql`
  query GetArticlesByCategoryShowcase($slug: String!, $limit: Int = 4) {
    articlesByCategory(slug: $slug, limit: $limit) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const GET_TOP_PICKS = gql`
  query GetTopPicks($limit: Int = 5) {
    topPicks(limit: $limit) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const GET_LATEST_ARTICLES = gql`
  query GetLatestArticles($limit: Int = 6, $offset: Int = 0) {
    latestArticles(limit: $limit, offset: $offset) {
      articles {
        ...ArticleFields
      }
      totalCount
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const GET_CATEGORY_DETAILS = gql`
  query GetCategoryDetails($slug: String!) {
    category(slug: $slug) {
      id
      name
      slug
      description
      availableTags
    }
  }
`;

export const GET_CATEGORY_PAGE_ARTICLES = gql`
  query GetCategoryPageArticles(
    $slug: String!,
    $limit: Int = 9,
    $offset: Int = 0,
    $sortBy: String = "newest",
    $tags: [String!] = []
  ) {
    categoryArticles(slug: $slug, limit: $limit, offset: $offset, sortBy: $sortBy, tags: $tags) {
      articles {
        ...ArticleFields
      }
      totalCount
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const SEARCH_ARTICLES = gql`
  query SearchArticles($query: String!, $limit: Int = 10, $offset: Int = 0) {
    searchArticles(query: $query, limit: $limit, offset: $offset) {
      articles {
        ...ArticleFields
      }
      totalCount
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const GET_ARTICLE_DETAILS = gql`
  query GetArticleDetails($slug: String!) {
    article(slug: $slug) {
      ...ArticleDetailFields
    }
  }
  ${ARTICLE_DETAIL_FRAGMENT}
`;

export const GET_RELATED_ARTICLES = gql`
  query GetRelatedArticles($slug: String!, $limit: Int = 3) {
    relatedArticles(slug: $slug, limit: $limit) {
      ...ArticleFields
    }
  }
  ${ARTICLE_FRAGMENT}
`;

export const GET_ARTICLE_COMMENTS = gql`
  query GetArticleComments($slug: String!, $limit: Int = 10, $offset: Int = 0) {
    articleComments(slug: $slug, limit: $limit, offset: $offset) {
      comments {
        ...CommentFields
      }
      totalCount
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile {
    userProfile {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_USER_PREFERENCES = gql`
  query GetUserPreferences {
    userPreferences {
      ...UserPreferencesFields
    }
  }
  ${USER_PREFERENCES_FRAGMENT}
`;

// --- Mutations --- //

export const CREATE_COMMENT = gql`
  mutation CreateComment($articleSlug: String!, $content: String!) {
    createComment(articleSlug: $articleSlug, content: $content) {
      ...CommentFields
    }
  }
  ${COMMENT_FRAGMENT}
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($name: String, $bio: String, $avatar: String) {
    updateUserProfile(name: $name, bio: $bio, avatar: $avatar) {
      ...UserFields
    }
  }
  ${USER_FRAGMENT}
`;

export const UPDATE_USER_PREFERENCES = gql`
  mutation UpdateUserPreferences(
    $darkMode: Boolean,
    $emailNotificationsEnabled: Boolean,
    $favoriteCategories: [String!],
    $preferredLevel: String,
    $preferredFormats: [String!]
  ) {
    updateUserPreferences(
      darkMode: $darkMode,
      emailNotificationsEnabled: $emailNotificationsEnabled,
      favoriteCategories: $favoriteCategories,
      preferredLevel: $preferredLevel,
      preferredFormats: $preferredFormats
    ) {
      ...UserPreferencesFields
    }
  }
  ${USER_PREFERENCES_FRAGMENT}
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const SUBSCRIBE_TO_NEWSLETTER = gql`
  mutation SubscribeToNewsletter($email: String!) {
    subscribeToNewsletter(email: $email) {
      success
      message
    }
  }
`;




// --- Password Reset Mutations --- //

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      success
      message
    }
  }
`;




// --- Email Verification Mutations --- //

export const REQUEST_EMAIL_VERIFICATION = gql`
  mutation RequestEmailVerification {
    requestEmailVerification {
      success
      message # e.g., "Verification email sent."
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($token: String!) {
    verifyEmail(token: $token) {
      success
      message # e.g., "Email verified successfully." or "Invalid/expired token."
      user { # Optionally return updated user info
        ...UserFields
        isEmailVerified # Add this field to the User type/fragment if needed
      }
    }
  }
  ${USER_FRAGMENT} # Include if returning user data
`;

