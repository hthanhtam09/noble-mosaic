import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ColoringPage } from '@/models/ColoringPage';
import { uploadImage } from '@/lib/cloudinary';
import { withAuth } from '@/lib/auth';

// GET - list pages (optional filter by folder)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const folderId = searchParams.get('folder');

    const query: Record<string, unknown> = {};
    if (folderId) {
      query.folder = folderId;
    }

    const pages = await ColoringPage.find(query)
      .sort({ order: 1, createdAt: 1 })
      .populate('folder', 'name slug')
      .lean();

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching coloring pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST - create a single coloring page with image upload (auth required)
export const POST = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folderId = formData.get('folder') as string;
    const title = (formData.get('title') as string) || file?.name?.replace(/\.[^/.]+$/, '') || 'Untitled';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    // Upload to Cloudinary
    const result = await uploadImage(file, `noble-mosaic/coloring/${folderId}`);

    // Get next order
    const maxOrder = await ColoringPage.findOne({ folder: folderId })
      .sort({ order: -1 })
      .select('order')
      .lean();
    const order = (maxOrder?.order || 0) + 1;

    const page = await ColoringPage.create({
      title,
      imageUrl: result.url,
      publicId: result.publicId,
      folder: folderId,
      order,
    });

    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error('Error creating coloring page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
});
