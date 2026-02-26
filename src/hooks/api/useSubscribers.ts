import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';

export interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export function useAdminSubscribers() {
  return useQuery({
    queryKey: [QUERY_KEYS.adminSubscribers],
    queryFn: async () => {
      const response = await api.get<any, { subscribers: Subscriber[] }>('/subscribers');
      return (response as any).subscribers || [];
    }
  });
}

export function useSubscribeNewsletter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string; source?: string; code?: string }) => {
      return api.post('/subscribers', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminSubscribers] });
    }
  });
}

export function useSendVerificationCode() {
  return useMutation({
    mutationFn: async (email: string) => {
      return api.post('/send-code', { email });
    }
  });
}
