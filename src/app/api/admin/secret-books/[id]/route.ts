import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretBook } from '@/models/SecretBook';
import { SecretImage } from '@/models/SecretImage';
import { deleteFolder, deleteImage } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    const body = await request.json();
    
    if (body.title && !body.slug) {
       body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (body.secretKey && body.secretKey.length > 6) {
      return NextResponse.json({ error: 'Secret Key must be exactly 6 characters or less' }, { status: 400 });
    }

    const book = await SecretBook.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return NextResponse.json({ error: 'Secret Book not found' }, { status: 404 });
    }
    
    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error updating secret book:', error);
    return NextResponse.json({ error: 'Failed to update secret book' }, { status: 500 });
  }
}

// Function to extract Cloudinary public ID from URL
const getPublicIdFromUrl = (url: string) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts.pop()?.split('.')[0];
  const folderPath = parts.slice(parts.indexOf('upload') + 2).join('/');
  return folderPath ? `${folderPath}/${filename}` : filename;
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    
    const book = await SecretBook.findByIdAndDelete(id);
    
    if (!book) {
      return NextResponse.json({ error: 'Secret Book not found' }, { status: 404 });
    }
    
    // Delete the specific cover image from cloudinary if it exists
    if (book.coverImage) {
      const coverPublicId = getPublicIdFromUrl(book.coverImage);
      if (coverPublicId) {
         await deleteImage(coverPublicId);
      }
    }

    // Clean up all images associated with this book in the database
    await SecretImage.deleteMany({ secretBook: id });

    // Delete the folder in Cloudinary
    await deleteFolder(`secrets/${book.slug}`);

    return NextResponse.json({ message: 'Secret book deleted successfully' });
  } catch (error) {
    console.error('Error deleting secret book:', error);
    return NextResponse.json({ error: 'Failed to delete secret book' }, { status: 500 });
  }
}
