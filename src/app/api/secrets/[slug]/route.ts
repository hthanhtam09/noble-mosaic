import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretImage } from '@/models/SecretImage';
import { SecretBook } from '@/models/SecretBook';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const slug = (await params).slug;
    
    // Find the secret book by slug
    const book = await SecretBook.findOne({ slug, isActive: true }).lean();
    
    if (!book) {
      return NextResponse.json({ error: 'Secret Book not found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const providedKey = searchParams.get('key');

    // Find first secret image to use as preview
    const firstSecret = await SecretImage.findOne({ 
      secretBook: book._id,
      isActive: true 
    }).sort({ order: 1 }).lean();

    const computedPreviewImage = firstSecret ? firstSecret.uncolorImageUrl : undefined;

    // If the book is protected by a secret key
    if (book.secretKey && book.secretKey !== providedKey) {
      return NextResponse.json({ 
        error: 'Unauthorized', 
        requiresKey: true,
        product: {
          title: book.title,
          slug: book.slug,
          coverImage: book.coverImage,
          amazonUrlStandard: book.amazonUrlStandard,
          amazonUrlPremium: book.amazonUrlPremium,
          previewImage: computedPreviewImage
        }
      }, { status: 403 });
    }
    
    // Find secret images for this book
    const secrets = await SecretImage.find({ 
      secretBook: book._id,
      isActive: true 
    })
      .sort({ order: 1, createdAt: -1 })
      .limit(1000)
      .lean();
    
    return NextResponse.json({ 
      product: {
        title: book.title,
        slug: book.slug,
        coverImage: book.coverImage,
        amazonUrlStandard: book.amazonUrlStandard,
        amazonUrlPremium: book.amazonUrlPremium,
        previewImage: computedPreviewImage
      },
      secrets 
    });
  } catch (error) {
    console.error('Error fetching book secrets:', error);
    return NextResponse.json({ error: 'Failed to fetch book secrets' }, { status: 500 });
  }
}
