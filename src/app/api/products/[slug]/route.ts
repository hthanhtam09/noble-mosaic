import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { withAuth } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    
    const product = await Product.findOne({ slug }).lean();
    
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
    
    const product = await Product.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true }
    );
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
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
    
    const product = await Product.findOneAndDelete({ slug });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
});
