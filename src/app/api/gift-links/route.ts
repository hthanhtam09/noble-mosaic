import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { GiftLink } from '@/models/GiftLink';
import { withAuth } from '@/lib/auth';

// GET - list all active gift links (public)
export async function GET() {
  try {
    await connectDB();

    const links = await GiftLink.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ links });
  } catch (error) {
    console.error('Error fetching gift links:', error);
    return NextResponse.json({ error: 'Failed to fetch gift links' }, { status: 500 });
  }
}

// POST - create a new gift link (auth required)
export const POST = withAuth(async (request: NextRequest) => {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, url, thumbnail } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Get next order value
    const maxOrder = await GiftLink.findOne().sort({ order: -1 }).select('order').lean();
    const order = (maxOrder?.order || 0) + 1;

    const link = await GiftLink.create({
      title,
      description: description || '',
      url,
      thumbnail: thumbnail || '',
      order,
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error('Error creating gift link:', error);
    return NextResponse.json({ error: 'Failed to create gift link' }, { status: 500 });
  }
});
