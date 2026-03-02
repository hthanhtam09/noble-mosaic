import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { SecretImage } from '@/models/SecretImage';
import { updateDocumentAndCleanImages, deleteDocumentAndCleanImages } from '@/lib/crud-utils';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const id = (await params).id;
    const body = await request.json();
    
    // Step 1: Update in DB and cleanup old images
    const secret = await updateDocumentAndCleanImages(SecretImage, { _id: id }, body);
    
    if (!secret) {
      return NextResponse.json({ error: 'Secret not found' }, { status: 404 });
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
    
    const secret = await deleteDocumentAndCleanImages(SecretImage, { _id: id });
    
    if (!secret) {
      return NextResponse.json({ error: 'Secret not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Secret deleted successfully' });
  } catch (error) {
    console.error('Error deleting secret:', error);
    return NextResponse.json({ error: 'Failed to delete secret' }, { status: 500 });
  }
}
