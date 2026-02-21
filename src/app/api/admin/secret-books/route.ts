import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretBook } from '@/models/SecretBook';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '0');
    
    let query = SecretBook.find({}).sort({ createdAt: -1 });
    
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    const books = await query.lean();
    
    return NextResponse.json({ books });
  } catch (error) {
    console.error('Error fetching secret books:', error);
    return NextResponse.json({ error: 'Failed to fetch secret books' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Generate slug from title if not provided
    const slug = body.slug || body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    if (body.secretKey && body.secretKey.length > 6) {
      return NextResponse.json({ error: 'Secret Key must be exactly 6 characters or less' }, { status: 400 });
    }
    
    const book = await SecretBook.create({
      ...body,
      slug,
    });
    
    return NextResponse.json({ book }, { status: 201 });
  } catch (error) {
    console.error('Error creating secret book:', error);
    return NextResponse.json({ error: 'Failed to create secret book' }, { status: 500 });
  }
}
