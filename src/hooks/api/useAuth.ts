import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';

export function useSession() {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      try {
        const data = await api.get('/auth');
        return data;
      } catch (error) {
        return null;
      }
    },
    retry: false
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: { username?: string; password?: string; secret?: string }) => {
      return api.post('/auth', credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session'] });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const data = await api.delete('/auth');
      return data;
    },
    onSuccess: () => {
      queryClient.setQueryData(['session'], null);
      queryClient.invalidateQueries({ queryKey: ['session'] });
    }
  });
}
