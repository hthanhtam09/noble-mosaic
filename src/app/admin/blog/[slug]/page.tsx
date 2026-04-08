'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useBlogPost, useUpdateBlogPost } from '@/hooks/api/useBlog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import BlogContentEditor from '@/components/admin/BlogContentEditor';
import { renderBlogContent } from '@/lib/blogRenderer';
import BlogThumbnailUploader from '@/components/admin/BlogThumbnailUploader';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  
  const { data: postData, isLoading } = useBlogPost(slug);
  const updateBlogPost = useUpdateBlogPost();

  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    category: 'General',
    content: '',
    published: true,
  });

  useEffect(() => {
    if (postData?.post) {
      setFormData({
        title: postData.post.title || '',
        thumbnail: postData.post.thumbnail || '',
        category: postData.post.category || 'General',
        content: postData.post.content || '',
        published: postData.post.published ?? true,
      });
    }
  }, [postData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateBlogPost.mutate({
      slug,
      data: formData
    }, {
      onSuccess: () => {
        toast({ title: "Post Updated", description: "Changes saved successfully. SEO metadata updated." });
        router.push('/admin/blog');
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.response?.data?.message || "Failed to update post.", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!postData?.post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold">Post Not Found</h2>
        <Button variant="link" asChild className="mt-4"><Link href="/admin/blog">Back to Blog Admin</Link></Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>
        <h1 className="text-2xl font-serif font-bold text-neutral-900">Edit Post</h1>
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
              <p className="text-xs text-neutral-400">SEO excerpt and keywords will be auto-updated based on your content changes.</p>
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
                  <label htmlFor="published" className="ml-3 text-sm font-medium text-neutral-600">Post is published</label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="ghost" asChild>
                  <Link href="/admin/blog">Cancel</Link>
                </Button>
                <Button type="submit" disabled={updateBlogPost.isPending} className="bg-neutral-900 text-white hover:bg-neutral-800 px-8">
                  {updateBlogPost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

