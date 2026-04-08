'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateBlogPost } from '@/hooks/api/useBlog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import BlogContentEditor from '@/components/admin/BlogContentEditor';
import { renderBlogContent } from '@/lib/blogRenderer';
import BlogThumbnailUploader from '@/components/admin/BlogThumbnailUploader';

export default function NewBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createBlogPost = useCreateBlogPost();

  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    category: 'General',
    content: '',
    published: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Minimal validation
    if (!formData.thumbnail) {
      toast({ title: 'Missing Thumbnail', description: 'Please upload or provide a thumbnail URL.', variant: 'destructive' });
      return;
    }

    createBlogPost.mutate(formData, {
      onSuccess: () => {
        toast({ title: 'Post Created', description: 'Your blog post has been created. SEO metadata was auto-generated.' });
        router.push('/admin/blog');
      },
      onError: (error: any) => {
        toast({ title: 'Error', description: error.response?.data?.message || 'Failed to create post.', variant: 'destructive' });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>
        <h1 className="text-2xl font-serif font-bold text-neutral-900">Create New Post</h1>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader><CardTitle>Post Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Thumbnail Section */}
              <div className="md:col-span-1">
                <BlogThumbnailUploader
                  value={formData.thumbnail}
                  onChange={thumbnail => setFormData({ ...formData, thumbnail })}
                />
              </div>

              {/* Basic Info Section */}
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Post Title</label>
                  <input
                    required type="text"
                    placeholder="Enter an engaging title..."
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-shadow text-lg font-serif"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <input
                    required type="text"
                    placeholder="e.g. Coloring Guide, Tips..."
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 transition-shadow"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Post Content</label>
              <BlogContentEditor
                value={formData.content}
                onChange={content => setFormData({ ...formData, content })}
                renderHtml={renderBlogContent}
              />
              <p className="text-xs text-neutral-400">SEO excerpt and keywords will be auto-generated from your content.</p>
            </div>

            <div className="flex items-center justify-between py-4 border-t border-neutral-100 mt-8">
              <div className="flex items-center gap-3">
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="published"
                    className="sr-only peer"
                    checked={formData.published}
                    onChange={e => setFormData({ ...formData, published: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  <label htmlFor="published" className="ml-3 text-sm font-medium text-neutral-600">Publish post immediately</label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/blog">Cancel</Link>
                </Button>
                <Button type="submit" disabled={createBlogPost.isPending} className="bg-neutral-900 text-white hover:bg-neutral-800 px-8">
                  {createBlogPost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Post
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}


