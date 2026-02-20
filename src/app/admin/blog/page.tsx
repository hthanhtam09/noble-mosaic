'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, Search, MoreVertical, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const samplePosts = [
  {
    _id: '1',
    title: 'The Science Behind Coloring and Stress Relief',
    slug: 'science-behind-coloring-stress-relief',
    thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=150&fit=crop',
    category: 'Wellness',
    published: true,
    createdAt: '2024-01-15',
  },
  {
    _id: '2',
    title: '10 Tips for Beginners Starting Color By Number',
    slug: 'tips-beginners-color-by-number',
    thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&h=150&fit=crop',
    category: 'Tips & Tricks',
    published: true,
    createdAt: '2024-01-10',
  },
  {
    _id: '3',
    title: 'Creating a Relaxing Coloring Space at Home',
    slug: 'creating-relaxing-coloring-space',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop',
    category: 'Lifestyle',
    published: true,
    createdAt: '2024-01-05',
  },
  {
    _id: '4',
    title: 'Color Psychology: Choosing the Right Palette',
    slug: 'color-psychology-choosing-palette',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200&h=150&fit=crop',
    category: 'Creative',
    published: false,
    createdAt: '2024-01-01',
  },
];

export default function AdminBlogPage() {
  const [posts, setPosts] = useState(samplePosts);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDelete = async (slug: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/blog/${slug}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setPosts(posts.filter(p => p.slug !== slug));
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
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
      <div className="grid gap-4">
        {filteredPosts.map((post) => (
          <Card key={post._id} className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="relative w-20 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

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
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
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
                        className="text-red-600"
                        onClick={() => handleDelete(post.slug)}
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
    </div>
  );
}
