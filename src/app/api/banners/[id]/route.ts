import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { uploadImage, deleteImage } from '@/lib/r2';
import { getAdminSession } from '@/lib/auth';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const isAdmin = await getAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const formData = await req.formData();
    const newImage = formData.get('image') as File | null;
    const link = formData.get('link') as string | null;
    const orderStr = formData.get('order') as string | null;
    const isActiveStr = formData.get('isActive') as string | null;

    const banner = await Banner.findById(params.id);
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    const updates: any = {};
    if (link !== null) updates.link = link;
    if (orderStr !== null) updates.order = parseInt(orderStr, 10);
    if (isActiveStr !== null) updates.isActive = isActiveStr === 'true';

    if (newImage) {
      // 1. Delete old image from R2
      if (banner.publicId) {
        await deleteImage(banner.publicId);
      }
      // 2. Upload new image
      const uploadResult = await uploadImage(newImage, 'noble-mosaic/banners');
      updates.imageUrl = uploadResult.url;
      updates.publicId = uploadResult.publicId;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { returnDocument: 'after' }
    );

    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const isAdmin = await getAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const banner = await Banner.findById(params.id);
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Delete image from R2
    if (banner.publicId) {
      await deleteImage(banner.publicId);
    }

    // Delete from DB
    await Banner.findByIdAndDelete(params.id);

    return NextResponse.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
