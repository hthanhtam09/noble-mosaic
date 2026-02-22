import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';

export function useAdminDashboard() {
  return useQuery({
    queryKey: [QUERY_KEYS.adminDashboard],
    queryFn: async () => {
      const data = await api.get('/admin/dashboard');
      return data;
    }
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.adminProducts],
    queryFn: async () => {
      const data = await api.get<any, { products: any[] }>('/products');
      return data.products || [];
    }
  });
}

export function useAdminSubscribers() {
  return useQuery({
    queryKey: [QUERY_KEYS.adminSubscribers],
    queryFn: async () => {
      const data = await api.get('/subscribers');
      return data;
    }
  });
}

export function useAdminContacts() {
  return useQuery({
    queryKey: [QUERY_KEYS.adminContacts],
    queryFn: async () => {
      const data = await api.get<any, { contacts: any[] }>('/contact');
      return data.contacts || [];
    }
  });
}

export function useAdminColoringFolders() {
  return useQuery({
    queryKey: [QUERY_KEYS.adminColoringFolders],
    queryFn: async () => {
      const data = await api.get<any, { folders: any[] }>('/coloring-folders');
      return data.folders || [];
    }
  });
}

export function useAdminColoringPages(folderId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.adminColoringPages, folderId],
    queryFn: async () => {
      if (!folderId) return [];
      const data = await api.get<any, { pages: any[] }>(`/coloring-folders/${folderId}`);
      return data.pages || [];
    },
    enabled: !!folderId,
  });
}

export function useAdminBlogPosts() {
  return useQuery({
    queryKey: [QUERY_KEYS.blogPosts, 'admin'],
    queryFn: async () => {
      const data = await api.get<any, { posts: any[] }>('/blog?all=true');
      return data.posts || [];
    }
  });
}

export function useAdminSecretBooks() {
  return useQuery({
    queryKey: [QUERY_KEYS.adminSecretBooks],
    queryFn: async () => {
      const data = await api.get<any, { books: any[] }>('/admin/secret-books');
      return data.books || [];
    }
  });
}

export function useAdminSecrets(bookId: string | undefined) {
  return useQuery({
    queryKey: [QUERY_KEYS.adminSecrets, bookId],
    queryFn: async () => {
      if (!bookId) return [];
      const data = await api.get<any, { secrets: any[] }>(`/admin/secrets?book=${bookId}`);
      return data.secrets || [];
    },
    enabled: !!bookId,
  });
}
