import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { GiftLink } from '@/models/GiftLink';
import { withAuth } from '@/lib/auth';

// GET - get a single gift link
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const link = await GiftLink.findById(id).lean();

    if (!link) {
      return NextResponse.json({ error: 'Gift link not found' }, { status: 404 });
    }

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Error fetching gift link:', error);
    return NextResponse.json({ error: 'Failed to fetch gift link' }, { status: 500 });
  }
}

// PUT - update a gift link (auth required)
export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { title, description, url, thumbnail, isActive } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (url !== undefined) updateData.url = url;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (isActive !== undefined) updateData.isActive = isActive;

    const link = await GiftLink.findByIdAndUpdate(id, updateData, { new: true }).lean();

    if (!link) {
      return NextResponse.json({ error: 'Gift link not found' }, { status: 404 });
    }

    return NextResponse.json({ link });
  } catch (error) {
    console.error('Error updating gift link:', error);
    return NextResponse.json({ error: 'Failed to update gift link' }, { status: 500 });
  }
});

// DELETE - delete a gift link (auth required)
export const DELETE = withAuth(async (
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    await connectDB();
    const { id } = await params;
    const link = await GiftLink.findByIdAndDelete(id);

    if (!link) {
      return NextResponse.json({ error: 'Gift link not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Gift link deleted successfully' });
  } catch (error) {
    console.error('Error deleting gift link:', error);
    return NextResponse.json({ error: 'Failed to delete gift link' }, { status: 500 });
  }
});
