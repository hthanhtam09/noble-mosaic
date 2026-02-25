import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const theme = searchParams.get('theme');
    const difficulty = searchParams.get('difficulty');
    const sort = searchParams.get('sort') || 'newest';
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '0');
    
    const query: Record<string, unknown> = {};
    
    if (theme) {
      query.theme = theme;
    }
    
    if (difficulty) {
      query.difficulty = difficulty;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { reviewCount: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    let productsQuery = Product.find(query).sort(sortOption);
    
    if (limit > 0) {
      productsQuery = productsQuery.limit(limit);
    }
    
    const products = await productsQuery.lean();
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const product = await Product.create({
      ...body,
      slug,
    });
    
    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      error: 'Failed to create product',
      message: error.message,
      details: error.errors
    }, { status: 500 });
  }
}
