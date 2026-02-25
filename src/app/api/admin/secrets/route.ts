import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretImage } from '@/models/SecretImage';
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

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

    // Find all secrets to get their image URLs before deletion
    const secrets = await SecretImage.find({ secretBook: bookId });
    
    const imagesToDelete: string[] = [];
    secrets.forEach(secret => {
      if (secret.colorImageUrl) {
        const pid = getPublicIdFromUrl(secret.colorImageUrl);
        if (pid) imagesToDelete.push(pid);
      }
      if (secret.uncolorImageUrl) {
        const pid = getPublicIdFromUrl(secret.uncolorImageUrl);
        if (pid) imagesToDelete.push(pid);
      }
    });

    // Delete records from DB
    await SecretImage.deleteMany({ secretBook: bookId });
    
    // Delete images from Cloudinary
    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map(pid => deleteImage(pid)));
    }
    
    return NextResponse.json({ message: 'All secrets and associated images deleted successfully' });
  } catch (error) {
    console.error('Error deleting secrets:', error);
    return NextResponse.json({ error: 'Failed to delete secrets' }, { status: 500 });
  }
}
