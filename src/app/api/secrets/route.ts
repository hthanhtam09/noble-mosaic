import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretImage } from '@/models/SecretImage';
import { SecretBook } from '@/models/SecretBook';

export async function GET() {
  try {
    await connectDB();
    
    // Find all secret books that have active secret images, or just fetch all active secret books
    // Since we created SecretBook explicitly for this, let's just return all active ones
    const books = await SecretBook.find({ isActive: true })
      .select('title slug coverImage')
      .sort({ createdAt: -1 })
      .lean();
    
    return NextResponse.json({ products: books }); // return as 'products' to maintain compatibility, or change frontend
  } catch (error) {
    console.error('Error fetching secret books:', error);
    return NextResponse.json({ error: 'Failed to fetch secret books' }, { status: 500 });
  }
}
