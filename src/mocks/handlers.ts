import { graphql, http } from 'msw';
import { mockArticles } from './mockData';

export const handlers = [
  graphql.query('GetArticles', (req, res, ctx) => {
    const { limit = 10, offset = 0 } = req.variables || {};
    
    return res(
      ctx.data({
        articles: mockArticles.slice(offset, offset + limit),
      })
    );
  }),
  
  graphql.query('GetArticleBySlug', (req, res, ctx) => {
    const { slug } = req.variables || {};
    const article = mockArticles.find(article => article.slug === slug);
    
    if (!article) {
      return res(
        ctx.errors([
          {
            message: `Article with slug "${slug}" not found`,
            extensions: { code: 'NOT_FOUND' },
          },
        ])
      );
    }
    
    return res(
      ctx.data({
        article,
      })
    );
  }),
  
  // REST API fallback example
  http.get('/api/articles', (req) => {
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get('limit') || 10);
    const offset = Number(url.searchParams.get('offset') || 0);
    
    return Response.json({
      articles: mockArticles.slice(offset, offset + limit),
      total: mockArticles.length,
    });
  }),
]; 