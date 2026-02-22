import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';

interface ColoringFolder {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  pageCount: number;
  pages?: ColoringPage[];
}

interface ColoringPage {
  _id: string;
  title: string;
  imageUrl: string;
  order: number;
}

export function useGiftFolders() {
  return useQuery({
    queryKey: [QUERY_KEYS.giftFolders],
    queryFn: async () => {
      const data = await api.get<any, { folders: ColoringFolder[] }>('/coloring-folders');
      return data.folders || [];
    }
  });
}
