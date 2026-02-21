import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretImage } from '@/models/SecretImage';
import { deleteImage } from '@/lib/cloudinary';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    const body = await request.json();
    
    const secret = await SecretImage.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!secret) {
      return NextResponse.json({ error: 'Secret not found' }, { status: 404 });
    }
    
    return NextResponse.json({ secret });
  } catch (error) {
    console.error('Error updating secret:', error);
    return NextResponse.json({ error: 'Failed to update secret' }, { status: 500 });
  }
}

// Function to extract Cloudinary public ID from URL
const getPublicIdFromUrl = (url: string) => {
  if (!url) return null;
  const parts = url.split('/');
  const filename = parts.pop()?.split('.')[0];
  const folderPath = parts.slice(parts.indexOf('upload') + 2).join('/');
  return folderPath ? `${folderPath}/${filename}` : filename;
};

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
