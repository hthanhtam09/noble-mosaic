import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { withAuth } from '@/lib/auth';
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

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
    
    // Fetch existing product for image comparison
    const existingProduct = await Product.findOne({ slug }).lean();
    
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Identify images to delete
    const imagesToDelete: string[] = [];

    // Check cover image
    if (existingProduct.coverImage && body.coverImage && existingProduct.coverImage !== body.coverImage) {
      const pid = getPublicIdFromUrl(existingProduct.coverImage);
      if (pid) imagesToDelete.push(pid);
    }

    // Check gallery images
    if (existingProduct.galleryImages && Array.isArray(existingProduct.galleryImages)) {
      const newGallery = body.galleryImages || [];
      existingProduct.galleryImages.forEach((url: string) => {
        if (!newGallery.includes(url)) {
          const pid = getPublicIdFromUrl(url);
          if (pid) imagesToDelete.push(pid);
        }
      });
    }

    // Check A+ Content images
    if (existingProduct.aPlusContent && Array.isArray(existingProduct.aPlusContent)) {
      const newAPlus = body.aPlusContent || [];
      const newImages = new Set<string>();
      
      // Collect all images in new A+ content
      newAPlus.forEach((block: any) => {
        if (typeof block === 'string') {
          newImages.add(block);
        } else {
          if (block.image) newImages.add(block.image);
          if (block.images && Array.isArray(block.images)) {
            block.images.forEach((url: string) => newImages.add(url));
          }
        }
      });

      // Compare with old ones
      existingProduct.aPlusContent.forEach((block: any) => {
        if (typeof block === 'string') {
          if (!newImages.has(block)) {
            const pid = getPublicIdFromUrl(block);
            if (pid) imagesToDelete.push(pid);
          }
        } else {
          if (block.image && !newImages.has(block.image)) {
            const pid = getPublicIdFromUrl(block.image);
            if (pid) imagesToDelete.push(pid);
          }
          if (block.images && Array.isArray(block.images)) {
            block.images.forEach((url: string) => {
              if (!newImages.has(url)) {
                const pid = getPublicIdFromUrl(url);
                if (pid) imagesToDelete.push(pid);
              }
            });
          }
        }
      });
    }

    // Check Editions images
    if (existingProduct.editions && Array.isArray(existingProduct.editions)) {
      const newEditions = body.editions || [];
      const newImages = new Set<string>();

      newEditions.forEach((edition: any) => {
        if (edition.coverImage) newImages.add(edition.coverImage);
        if (edition.aPlusContent && Array.isArray(edition.aPlusContent)) {
          edition.aPlusContent.forEach((img: any) => {
            if (typeof img === 'string') newImages.add(img);
          });
        }
      });

      existingProduct.editions.forEach((edition: any) => {
        if (edition.coverImage && !newImages.has(edition.coverImage)) {
          const pid = getPublicIdFromUrl(edition.coverImage);
          if (pid) imagesToDelete.push(pid);
        }
        if (edition.aPlusContent && Array.isArray(edition.aPlusContent)) {
          edition.aPlusContent.forEach((img: any) => {
            if (typeof img === 'string' && !newImages.has(img)) {
              const pid = getPublicIdFromUrl(img);
              if (pid) imagesToDelete.push(pid);
            }
          });
        }
      });
    }

    // Update slug if it doesn't match the title
    if (body.title) {
      const expectedSlug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
        
      if (existingProduct.slug !== expectedSlug) {
        body.slug = expectedSlug;
      }
    }

    // Perform DB update
    const product = await Product.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true }
    );
    
    // If update successful, delete orphaned images from Cloudinary
    if (product && imagesToDelete.length > 0) {
      // Use fire-and-forget or await? Usually better to await to ensure cleanup, 
      // but fire-and-forget is faster for response time.
      // Given the requirement "don't keep to clean data", let's await.
      await Promise.all(imagesToDelete.map(pid => deleteImage(pid)));
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

    // Clean up images from Cloudinary
    const imagesToDelete: string[] = [];

    if (product.coverImage) {
      const pid = getPublicIdFromUrl(product.coverImage);
      if (pid) imagesToDelete.push(pid);
    }

    if (product.galleryImages && Array.isArray(product.galleryImages)) {
      product.galleryImages.forEach((url: string) => {
        const pid = getPublicIdFromUrl(url);
        if (pid) imagesToDelete.push(pid);
      });
    }

    if (product.aPlusContent && Array.isArray(product.aPlusContent)) {
      product.aPlusContent.forEach((block: any) => {
        if (typeof block === 'string') {
          const pid = getPublicIdFromUrl(block);
          if (pid) imagesToDelete.push(pid);
        } else {
          if (block.image) {
            const pid = getPublicIdFromUrl(block.image);
            if (pid) imagesToDelete.push(pid);
          }
          if (block.images && Array.isArray(block.images)) {
            block.images.forEach((url: string) => {
              const pid = getPublicIdFromUrl(url);
              if (pid) imagesToDelete.push(pid);
            });
          }
        }
      });
    }

    if (product.editions && Array.isArray(product.editions)) {
      product.editions.forEach((edition: any) => {
        if (edition.coverImage) {
          const pid = getPublicIdFromUrl(edition.coverImage);
          if (pid) imagesToDelete.push(pid);
        }
        if (edition.aPlusContent && Array.isArray(edition.aPlusContent)) {
          edition.aPlusContent.forEach((img: any) => {
            if (typeof img === 'string') {
              const pid = getPublicIdFromUrl(img);
              if (pid) imagesToDelete.push(pid);
            }
          });
        }
      });
    }

    // Delete all identified images
    await Promise.all(imagesToDelete.map(pid => deleteImage(pid)));
    
    return NextResponse.json({ message: 'Product and associated images deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
});
