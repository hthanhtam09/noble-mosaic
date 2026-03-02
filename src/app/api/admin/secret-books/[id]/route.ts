import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretBook } from '@/models/SecretBook';
import { SecretImage } from '@/models/SecretImage';
import { deleteFolder } from '@/lib/cloudinary';
import { updateDocumentAndCleanImages, deleteDocumentAndCleanImages } from '@/lib/crud-utils';

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

    // Step 1: Update in DB and cleanup old image
    const book = await updateDocumentAndCleanImages(SecretBook, { _id: id }, body);
    
    if (!book) {
      return NextResponse.json({ error: 'Secret Book not found' }, { status: 404 });
    }
    
    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error updating secret book:', error);
    return NextResponse.json({ error: 'Failed to update secret book' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    
    // Deletes SecretBook and its coverImage from Cloudinary
    const book = await deleteDocumentAndCleanImages(SecretBook, { _id: id });
    
    if (!book) {
      return NextResponse.json({ error: 'Secret Book not found' }, { status: 404 });
    }
    
    // Clean up all images associated with this book in the database
    // Note: This does not delete the Cloudinary images for those SecretImages automatically using the utility,
    // but the next step deletes the entire folder anyway.
    await SecretImage.deleteMany({ secretBook: id });

    // Delete the folder in Cloudinary
    await deleteFolder(`secrets/${book.slug}`);

    return NextResponse.json({ message: 'Secret book deleted successfully' });
  } catch (error) {
    console.error('Error deleting secret book:', error);
    return NextResponse.json({ error: 'Failed to delete secret book' }, { status: 500 });
  }
}
