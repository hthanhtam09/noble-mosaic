import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Banner {
  _id: string;
  imageUrl: string;
  publicId: string;
  link?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const bannerKeys = {
  all: ['banners'] as const,
  lists: () => [...bannerKeys.all, 'list'] as const,
  detail: (id: string) => [...bannerKeys.all, 'detail', id] as const,
};

// Fetch all banners
export const useBanners = () => {
  return useQuery<Banner[], Error>({
    queryKey: bannerKeys.lists(),
    queryFn: async () => {
      const response = await fetch('/api/banners');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

// Create a new banner
export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/banners', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create banner');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};

// Update an existing banner
export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update banner');
      }

      return response.json();
    },
    onSuccess: (updatedBanner) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bannerKeys.detail(updatedBanner._id) });
    },
  });
};

// Delete a banner
export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};
