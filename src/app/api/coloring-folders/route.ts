import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { ColoringFolder } from '@/models/ColoringFolder';
import { ColoringPage } from '@/models/ColoringPage';
import { withAuth } from '@/lib/auth';

// GET - list all folders (public) with page counts
export async function GET() {
  try {
    await connectDB();

    const folders = await ColoringFolder.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    // Get page counts per folder
    const folderIds = folders.map((f) => f._id);
    const pageCounts = await ColoringPage.aggregate([
      { $match: { folder: { $in: folderIds } } },
      { $group: { _id: '$folder', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(
      pageCounts.map((p: { _id: string; count: number }) => [p._id.toString(), p.count])
    );

    const foldersWithCounts = folders.map((f) => ({
      ...f,
      pageCount: countMap.get(f._id.toString()) || 0,
    }));

    return NextResponse.json({ folders: foldersWithCounts });
  } catch (error) {
    console.error('Error fetching coloring folders:', error);
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 });
  }
}

// POST - create a new folder (auth required)
export const POST = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();

    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check for existing slug
    const existing = await ColoringFolder.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'A folder with this name already exists' }, { status: 409 });
    }

    // Get next order value
    const maxOrder = await ColoringFolder.findOne().sort({ order: -1 }).select('order').lean();
    const order = (maxOrder?.order || 0) + 1;

    const folder = await ColoringFolder.create({
      name,
      slug,
      description: description || '',
      order,
    });

    return NextResponse.json({ folder }, { status: 201 });
  } catch (error) {
    console.error('Error creating coloring folder:', error);
    return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
  }
});
