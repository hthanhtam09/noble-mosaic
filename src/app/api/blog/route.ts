import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { BlogPost } from '@/models/BlogPost';
import { withAuth } from '@/lib/auth';
import { generateExcerpt, extractKeywords } from '@/lib/blogSeo';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '0');
    const all = searchParams.get('all');
    
    const query: Record<string, unknown> = {};
    
    // Only show published posts by default (public); admin can pass all=true
    if (all !== 'true') {
      query.published = true;
    }
    
    if (category) {
      query.category = category;
    }
    
    let blogQuery = BlogPost.find(query).sort({ createdAt: -1 });
    
    if (limit > 0) {
      blogQuery = blogQuery.limit(limit);
    }
    
    const posts = await blogQuery.lean();
    
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export const POST = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Auto-generate excerpt if missing
    if (!body.excerpt && body.content) {
      body.excerpt = generateExcerpt(body.content);
    }
    
    // Auto-generate SEO keywords if missing
    if ((!body.seoKeywords || body.seoKeywords.length === 0) && body.content) {
      body.seoKeywords = extractKeywords(body.title, body.content);
    }
    
    const post = await BlogPost.create({
      ...body,
      slug,
    });
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
});
