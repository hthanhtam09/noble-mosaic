import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useCreateGiftLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newLink: Partial<GiftLinkItem>) => {
      const data = await api.post('/gift-links', newLink);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.giftLinks] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminGiftLinks] });
    }
  });
}

export function useUpdateGiftLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, item }: { id: string; item: Partial<GiftLinkItem> }) => {
      const data = await api.put(`/gift-links/${id}`, item);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.giftLinks] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminGiftLinks] });
    }
  });
}

export function useDeleteGiftLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const data = await api.delete(`/gift-links/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.giftLinks] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminGiftLinks] });
    }
  });
}
