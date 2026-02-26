import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';

// Placeholder types
export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  thumbnail: string;
  category: string;
  published: boolean;
  createdAt: string;
  content?: string;
}

export interface RelatedPost {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category?: string;
  createdAt: string;
}

export function useBlogPosts() {
  return useQuery({
    queryKey: [QUERY_KEYS.blogPosts],
    queryFn: async () => {
      const data = await api.get<any, { posts: BlogPost[] }>('/blog');
      return data.posts || [];
    }
  });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.blogPost, slug],
    queryFn: async () => {
      const data = await api.get<any, { post: BlogPost }>(`/blog/${slug}`);
      
      let relatedPosts: RelatedPost[] = [];
      try {
        const relData = await api.get<any, { posts: RelatedPost[] }>('/blog?limit=4');
        relatedPosts = (relData.posts || [])
          .filter(p => p.slug !== slug)
          .slice(0, 3);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
      
      return {
        post: data.post,
        relatedPosts,
      };
    },
    enabled: !!slug,
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (slug: string) => {
      const data = await api.delete(`/blog/${slug}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blogPosts] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blogPosts, 'admin'] });
    }
  });
}
