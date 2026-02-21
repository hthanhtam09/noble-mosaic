import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ColoringFolder } from '@/models/ColoringFolder';
import { ColoringPage } from '@/models/ColoringPage';
import { deleteImage } from '@/lib/cloudinary';
import { withAuth } from '@/lib/auth';

// GET - get folder details with all pages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const folder = await ColoringFolder.findById(id).lean();
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const pages = await ColoringPage.find({ folder: id })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({ folder, pages });
  } catch (error) {
    console.error('Error fetching folder:', error);
    return NextResponse.json({ error: 'Failed to fetch folder' }, { status: 500 });
  }
}

// PUT - update folder (auth required)
export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = {};
    if (body.name !== undefined) {
      updateData.name = body.name;
      updateData.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (body.description !== undefined) updateData.description = body.description;
    if (body.order !== undefined) updateData.order = body.order;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;
    if (body.thumbnail !== undefined) updateData.thumbnail = body.thumbnail;

    const folder = await ColoringFolder.findByIdAndUpdate(id, updateData, { new: true }).lean();
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json({ folder });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json({ error: 'Failed to update folder' }, { status: 500 });
  }
});

// DELETE - delete folder and all its pages + images (auth required)
export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();
    const { id } = await params;

    // Get all pages in this folder to delete their images
    const pages = await ColoringPage.find({ folder: id }).lean();

    // Delete images from Cloudinary
    for (const page of pages) {
      if (page.publicId) {
        await deleteImage(page.publicId);
      }
    }

    // Delete all pages in this folder
    await ColoringPage.deleteMany({ folder: id });

    // Delete the folder
    const folder = await ColoringFolder.findByIdAndDelete(id);
    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
});
