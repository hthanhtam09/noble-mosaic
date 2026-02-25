import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretImage } from '@/models/SecretImage';
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    const body = await request.json();
    
    // Step 1: Fetch existing secret for image comparison
    const existingSecret = await SecretImage.findById(id).lean();
    
    if (!existingSecret) {
      return NextResponse.json({ error: 'Secret not found' }, { status: 404 });
    }

    // Step 2: Update in DB
    const secret = await SecretImage.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    // Step 3: Cleanup old images if changed
    if (secret) {
      // Color Image
      if (existingSecret.colorImageUrl && body.colorImageUrl && existingSecret.colorImageUrl !== body.colorImageUrl) {
        const pid = getPublicIdFromUrl(existingSecret.colorImageUrl);
        if (pid) await deleteImage(pid);
      }
      
      // Uncolor Image
      if (existingSecret.uncolorImageUrl && body.uncolorImageUrl && existingSecret.uncolorImageUrl !== body.uncolorImageUrl) {
        const pid = getPublicIdFromUrl(existingSecret.uncolorImageUrl);
        if (pid) await deleteImage(pid);
      }
    }
    
    return NextResponse.json({ secret });
  } catch (error) {
    console.error('Error updating secret:', error);
    return NextResponse.json({ error: 'Failed to update secret' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    
    const secret = await SecretImage.findByIdAndDelete(id);
    
    if (!secret) {
      return NextResponse.json({ error: 'Secret not found' }, { status: 404 });
    }

    if (secret.colorImageUrl) {
       const colorPublicId = getPublicIdFromUrl(secret.colorImageUrl);
       if (colorPublicId) await deleteImage(colorPublicId);
    }
    
    if (secret.uncolorImageUrl) {
       const uncolorPublicId = getPublicIdFromUrl(secret.uncolorImageUrl);
       if (uncolorPublicId) await deleteImage(uncolorPublicId);
    }
    
    return NextResponse.json({ message: 'Secret deleted successfully' });
  } catch (error) {
    console.error('Error deleting secret:', error);
    return NextResponse.json({ error: 'Failed to delete secret' }, { status: 500 });
  }
}
