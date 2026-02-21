import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ColoringPage } from '@/models/ColoringPage';
import { deleteImage } from '@/lib/cloudinary';
import { withAuth } from '@/lib/auth';

// DELETE - delete a single coloring page + its Cloudinary image (auth required)
export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();
    const { id } = await params;

    const page = await ColoringPage.findById(id);
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (page.publicId) {
      await deleteImage(page.publicId);
    }

    await ColoringPage.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting coloring page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
});
