import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function useAdminContacts() {
  return useQuery({
    queryKey: [QUERY_KEYS.adminContacts],
    queryFn: async () => {
      const response = await api.get<any, { contacts: ContactMessage[] }>('/contact');
      // Axios response data is usually in response.data, but my api wrapper might return it directly
      return (response as any).contacts || [];
    }
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      const data = await api.patch('/contact', { id, read });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminContacts] });
    }
  });
}

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (message: { name: string; email: string; message: string }) => {
      const data = await api.post('/contact', message);
      return data;
    }
  });
}
