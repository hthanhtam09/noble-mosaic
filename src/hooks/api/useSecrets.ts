import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';

interface SecretBook {
  _id: string;
  title: string;
  slug: string;
  coverImage: string;
  secretKey?: string;
  amazonUrl?: string;
}

interface SecretImage {
  _id: string;
  colorImageUrl: string;
  uncolorImageUrl: string;
  order: number;
}

export function useSecretBooks() {
  return useQuery({
    queryKey: [QUERY_KEYS.secretBooks],
    queryFn: async () => {
      const data = await api.get<any, { books: SecretBook[] }>('/secrets');
      return data.books || [];
    }
  });
}

export function useSecretBookDetails(slug: string, isUnlocked: boolean) {
  return useQuery({
    queryKey: [QUERY_KEYS.secretBookDetails, slug, isUnlocked],
    queryFn: async () => {
      try {
        const url = isUnlocked ? `/secrets/${slug}?unlocked=true` : `/secrets/${slug}`;
        const data = await api.get<any, any>(url);
        return data;
      } catch (error: any) {
        if (error.response && error.response.status === 403 && error.response.data) {
           return error.response.data;
        }
        throw error;
      }
    },
    enabled: !!slug,
  });
}
