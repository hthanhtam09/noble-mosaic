import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { uploadImage, getPublicIdFromUrl } from '@/lib/r2';
import { getAdminSession } from '@/lib/auth';

// GET all active banners (publicly accessible)
export async function GET() {
  try {
    await dbConnect();
    // In admin, we might want to see all banners, but for the public slider, only active ones.
    // Let's return all banners here and sort by order. The frontend can filter if needed, 
    // or we can add a query param. For simplicity, return all sorted by order.
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    return NextResponse.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

// POST a new banner (admin only)
export async function POST(req: NextRequest) {
  try {
    const isAdmin = await getAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const formData = await req.formData();
    const image = formData.get('image') as File | null;
    const link = formData.get('link') as string || '';
    const orderStr = formData.get('order') as string | null;
    const order = orderStr ? parseInt(orderStr, 10) : 0;
    const isActiveStr = formData.get('isActive') as string | null;
    const isActive = isActiveStr === 'true' || isActiveStr === null; // Default true

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Upload to R2
    const uploadResult = await uploadImage(image, 'noble-mosaic/banners');
    
    // Create new banner record
    const newBanner = await Banner.create({
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,
      link,
      order,
      isActive
    });

    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: 'Failed to create banner' }, { status: 500 });
  }
}
