import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretBook } from '@/models/SecretBook';
import { SecretImage } from '@/models/SecretImage';
import { deleteFolder, deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    const body = await request.json();
    
    // Fetch existing book for image comparison
    const existingBook = await SecretBook.findById(id).lean();
    
    if (!existingBook) {
      return NextResponse.json({ error: 'Secret Book not found' }, { status: 404 });
    }

    if (body.title && !body.slug) {
       body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    if (body.secretKey && body.secretKey.length > 6) {
      return NextResponse.json({ error: 'Secret Key must be exactly 6 characters or less' }, { status: 400 });
    }

    // Step 2: Update in DB
    const book = await SecretBook.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    // Step 3: Cleanup old image if changed
    if (book && existingBook.coverImage && body.coverImage && existingBook.coverImage !== body.coverImage) {
      const pid = getPublicIdFromUrl(existingBook.coverImage);
      if (pid) {
        await deleteImage(pid);
      }
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
