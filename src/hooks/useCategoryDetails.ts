// src/hooks/useCategoryDetails.ts
import { useQuery } from '@tanstack/react-query';
import { fetchGraphQL } from '@/lib/api/fetchGraphQL';
import { GET_CATEGORY_DETAILS } from '@/lib/graphql/queries';

interface CategoryDetails {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface UseCategoryDetailsOptions {
  slug: string;
}

export function useCategoryDetails({ slug }: UseCategoryDetailsOptions) {
  return useQuery<CategoryDetails | null, Error>({
    queryKey: ['categoryDetails', slug],
    queryFn: async () => {
      const data = await fetchGraphQL(GET_CATEGORY_DETAILS, { slug });
      return data.category as CategoryDetails | null;
    },
    enabled: !!slug, // Only run the query if a slug is provided
    staleTime: 60 * 60 * 1000, // 1 hour - category details don't change often
  });
}
