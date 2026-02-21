import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ColoringPage } from '@/models/ColoringPage';
import { uploadImage } from '@/lib/cloudinary';
import { withAuth } from '@/lib/auth';

// POST - batch upload multiple images to a folder (auth required)
export const POST = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();

    const formData = await request.formData();
    const folderId = formData.get('folder') as string;
    const files = formData.getAll('files') as File[];

    if (!folderId) {
      return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
    }

    if (!files.length) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    // Get current max order
    const maxOrder = await ColoringPage.findOne({ folder: folderId })
      .sort({ order: -1 })
      .select('order')
      .lean();
    let currentOrder = (maxOrder?.order || 0) + 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createdPages: any[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const result = await uploadImage(file, `noble-mosaic/coloring/${folderId}`);
        const title = file.name.replace(/\.[^/.]+$/, '');

        const page = await ColoringPage.create({
          title,
          imageUrl: result.url,
          publicId: result.publicId,
          folder: folderId,
          order: currentOrder++,
        });

        createdPages.push(page);
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        errors.push(file.name);
      }
    }

    return NextResponse.json({
      pages: createdPages,
      uploaded: createdPages.length,
      failed: errors.length,
      errors,
    }, { status: 201 });
  } catch (error) {
    console.error('Error batch uploading coloring pages:', error);
    return NextResponse.json({ error: 'Failed to batch upload' }, { status: 500 });
  }
});
