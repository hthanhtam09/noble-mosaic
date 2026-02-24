import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretImage } from '@/models/SecretImage';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const bookId = searchParams.get('book');
    
    let query = {};
    if (bookId) {
      query = { secretBook: bookId };
    }
    
    // Using populate to get product details if needed
    const secrets = await SecretImage.find(query)
      .populate('secretBook', 'title slug')
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    return NextResponse.json({ secrets });
  } catch (error) {
    console.error('Error fetching secrets:', error);
    return NextResponse.json({ error: 'Failed to fetch secrets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Ensure we map product -> secretBook if frontend still sends product
    if (body.product && !body.secretBook) {
      body.secretBook = body.product;
      delete body.product;
    }
    
    const secret = await SecretImage.create(body);
    
    return NextResponse.json({ secret }, { status: 201 });
  } catch (error) {
    console.error('Error creating secret:', error);
    return NextResponse.json({ error: 'Failed to create secret' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const searchParams = request.nextUrl.searchParams;
    const bookId = searchParams.get('bookId');
    
    if (!bookId) {
      return NextResponse.json({ error: 'bookId is required' }, { status: 400 });
    }
    
    await SecretImage.deleteMany({ secretBook: bookId });
    
    return NextResponse.json({ message: 'All secrets deleted successfully' });
  } catch (error) {
    console.error('Error deleting secrets:', error);
    return NextResponse.json({ error: 'Failed to delete secrets' }, { status: 500 });
  }
}
