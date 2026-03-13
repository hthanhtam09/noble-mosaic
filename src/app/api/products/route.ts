import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '0');
    
    const query: Record<string, unknown> = {};
    
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
    
    let productsQuery = Product.find(query)
      .select('-theme -difficulty -bulletPoints')
      .sort(sortOption);
    
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
    
    // Auto-generate links from ASIN if missing
    if (!body.amazonLink && body.asin) {
      body.amazonLink = `https://www.amazon.com/dp/${body.asin}`;
    }

    if (body.editions && Array.isArray(body.editions)) {
      body.editions = body.editions.map((edition: any) => ({
        ...edition,
        link: (!edition.link && edition.asin) ? `https://www.amazon.com/dp/${edition.asin}` : edition.link
      }));
    }

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
