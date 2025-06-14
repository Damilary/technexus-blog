import { useState } from "react";
import { Article, User, Comment } from "@/types";
import { graphqlRequest } from "@/lib/api/graphqlClient";
import { handleError, AppError, ErrorCodes } from "@/lib/error";
import { cn } from "@/lib/utils";
import { validateEnv } from "@/lib/env";

// GraphQL query for fetching articles
const GET_ARTICLES = `
  query GetArticles($limit: Int, $offset: Int) {
    articles(limit: $limit, offset: $offset) {
      id
      title
      excerpt
      slug
      publishedAt
      author {
        id
        name
        image
      }
      tags {
        id
        name
      }
    }
  }
`;

interface ArticleListProps {
  className?: string;
}

export function ArticleList({ className }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await graphqlRequest<{ articles: Article[] }>(
        GET_ARTICLES,
        {
          limit: 10,
          offset: 0,
        }
      );

      setArticles(response.articles);
    } catch (err) {
      const error = handleError(err);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-2xl font-bold">Latest Articles</h2>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{article.author.name}</span>
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </time>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

// In your app initialization
validateEnv(["REQUIRED_VAR_1", "REQUIRED_VAR_2"]);
