'use client';

import { useState } from 'react';
import { useAdminBlogPosts } from '@/hooks/api/useAdmin';
import { useDeleteBlogPost } from '@/hooks/api/useBlog';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, MoreVertical, Calendar, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  category: string;
  published: boolean;
  createdAt: string;
}

export default function AdminBlogPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: posts = [], isLoading } = useAdminBlogPosts();
  const deleteBlogPostMutation = useDeleteBlogPost();

  const [searchQuery, setSearchQuery] = useState('');
  const [processingSlug, setProcessingSlug] = useState<string | null>(null);

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      setProcessingSlug(slug);
      deleteBlogPostMutation.mutate(slug, {
        onSuccess: () => {
          toast({
            title: "Post Deleted",
            description: "The blog post has been successfully deleted."
          });
        },
        onError: (error: any) => {
          console.error('Error deleting post:', error);
          toast({
            title: "Error",
            description: error.response?.data?.message || error.message || "Failed to delete the blog post.",
            variant: "destructive"
          });
        },
        onSettled: () => {
          setProcessingSlug(null);
        }
      });
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Blog Posts</h1>
          <p className="text-neutral-500 text-sm mt-1">Manage your blog content</p>
        </div>
        <Button asChild className="bg-neutral-900 hover:bg-neutral-800 text-white">
          <Link href="/admin/blog/new">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
        />
      </div>

      {/* Posts List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-neutral-300" />
            </div>
            <p className="text-neutral-500 mb-4">
              {posts.length === 0 ? 'No blog posts yet. Create your first post!' : 'No posts found matching your search.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <Card key={post._id} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  {post.thumbnail && (
                    <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-neutral-900 truncate">{post.title}</h3>
                      <Badge
                        variant={post.published ? 'default' : 'secondary'}
                        className={post.published ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-500">
                      <Badge variant="outline" className="text-xs">{post.category}</Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={processingSlug === post.slug}>
                          {processingSlug === post.slug ? (
                            <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                          ) : (
                            <MoreVertical className="h-4 w-4" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/blog/${post.slug}`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={() => handleDelete(post.slug)}
                          disabled={processingSlug === post.slug}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
