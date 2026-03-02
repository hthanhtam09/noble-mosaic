import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BlogPost } from '@/models/BlogPost';
import { withAuth } from '@/lib/auth';
import { updateDocumentAndCleanImages, deleteDocumentAndCleanImages } from '@/lib/crud-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    
    const post = await BlogPost.findOne({ slug, published: true }).lean();
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    await connectDB();
    const { slug } = await params;
    const body = await request.json();
    
    // Fetch existing post to check slug changes
    const existingPost = await BlogPost.findOne({ slug }).select('slug title').lean();
    
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Update slug if title changes
    if (body.title && body.title !== existingPost.title) {
      const expectedSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
      if (existingPost.slug !== expectedSlug) {
        body.slug = expectedSlug;
      }
    }

    const post = await updateDocumentAndCleanImages(BlogPost, { slug }, body);
    
    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    await connectDB();
    const { slug } = await params;
    
    const post = await deleteDocumentAndCleanImages(BlogPost, { slug });
    
    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Blog post and associated images deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
});
