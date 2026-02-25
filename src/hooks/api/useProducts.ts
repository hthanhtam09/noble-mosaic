import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { QUERY_KEYS } from '@/lib/query-keys';
export interface Product {
  _id: string;
  name?: string;
  title: string;
  slug: string;
  amazonUrl?: string;
  amazonLink?: string;
  thumbnail?: string;
  coverImage: string;
  galleryImages?: string[];
  price?: number | string;
  description?: string;
  shortDescription?: string;
  bulletPoints?: string[];
  rating?: number;
  reviewCount?: number;
  theme: string;
  difficulty: string;
  aPlusContent?: {
    type: 'fullWidth' | 'twoColumn' | 'featureHighlight' | 'lifestyle';
    title?: string;
    content?: string;
    image?: string;
    images?: string[];
    items?: { title: string; description: string; icon?: string }[];
  }[];
  editions?: {
    name: string;
    link: string;
    price?: string;
  }[];
}

export interface RelatedProduct {
  _id: string;
  name?: string;
  title: string;
  slug: string;
  thumbnail?: string;
  coverImage: string;
  price?: number | string;
}

interface HomeProductsResponse {
  products?: Product[];
}

export function useHomeProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.homeProducts],
    queryFn: async () => {
      const [featuredData, bestData] = await Promise.all([
        api.get<any, HomeProductsResponse>('/products?featured=true&limit=4').catch(() => ({ products: [] })),
        api.get<any, HomeProductsResponse>('/products?limit=4').catch(() => ({ products: [] })),
      ]);

      const featuredList = (featuredData.products?.length ?? 0) > 0
        ? featuredData.products
        : bestData.products ?? [];

      return {
        featured: featuredList as Product[],
        bestSeller: (bestData.products ?? []) as Product[],
      };
    },
  });
}

export function useProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.products],
    queryFn: async () => {
      const data = await api.get<any, { products: Product[] }>('/products');
      return data.products || [];
    }
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.product, slug],
    queryFn: async () => {
      const data = await api.get<any, { product: Product }>(`/products/${slug}`);
      
      let relatedProducts: RelatedProduct[] = [];
      try {
        const relData = await api.get<any, { products: RelatedProduct[] }>('/products?limit=10');
        relatedProducts = (relData.products || [])
          .filter(p => p.slug !== slug)
          .slice(0, 8);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }

      return {
        product: data.product,
        relatedProducts,
      };
    },
    enabled: !!slug,
  });
}
