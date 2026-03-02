import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { withAuth } from '@/lib/auth';
import { updateDocumentAndCleanImages, deleteDocumentAndCleanImages } from '@/lib/crud-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    
    const product = await Product.findOne({ slug })
      .select('-theme -difficulty -bulletPoints')
      .lean();
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

export const PUT = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    await connectDB();
    const { slug } = await params;
    const body = await request.json();
    
    // Fetch existing product for image comparison
    const existingProduct = await Product.findOne({ slug }).select('slug title').lean();
    
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update slug if it doesn't match the title
    if (body.title && body.title !== existingProduct.title) {
      const expectedSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
      if (existingProduct.slug !== expectedSlug) {
        body.slug = expectedSlug;
      }
    }

    // Perform DB update and clean images
    const product = await updateDocumentAndCleanImages(Product, { slug }, body);
    
    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
});

export const DELETE = withAuth(async (
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    await connectDB();
    const { slug } = await params;
    
    const product = await deleteDocumentAndCleanImages(Product, { slug });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
});
