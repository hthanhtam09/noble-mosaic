import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';

export interface GiftLinkItem {
  _id: string;
  title: string;
  description?: string;
  url: string;
  thumbnail?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useGiftLinks() {
  return useQuery({
    queryKey: [QUERY_KEYS.giftLinks],
    queryFn: async () => {
      const data = await api.get<any, { links: GiftLinkItem[] }>('/gift-links');
      return data.links || [];
    }
  });
}
