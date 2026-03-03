import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';

// Types
export interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  image: string;
  link: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateBannerDTO = Omit<Banner, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateBannerDTO = Partial<CreateBannerDTO>;

// Client Queries
export function useBanners() {
  return useQuery({
    queryKey: [QUERY_KEYS.banners],
    queryFn: async () => {
      const data = await api.get<any, { banners: Banner[] }>('/banners');
      return data.banners || [];
    }
  });
}

// Admin Queries
export function useAdminBanners() {
  return useQuery({
    queryKey: [QUERY_KEYS.adminBanners],
    queryFn: async () => {
      const data = await api.get<any, { banners: Banner[] }>('/admin/banners');
      return data.banners || [];
    }
  });
}

// Admin Mutations
export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBannerDTO) => {
      const response = await api.post<any, { banner: Banner }>('/admin/banners', data);
      return response.banner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminBanners] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banners] });
    }
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBannerDTO }) => {
      const response = await api.put<any, { banner: Banner }>(`/admin/banners/${id}`, data);
      return response.banner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminBanners] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banners] });
    }
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/banners/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.adminBanners] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.banners] });
    }
  });
}
