import mongoose, { Model } from 'mongoose';
import { deleteImage, getPublicIdFromUrl } from '@/lib/cloudinary';

/**
 * Recursively extracts all Cloudinary URLs from an object, array, or string.
 * @param data The data to search (can be a string, array, object, etc.)
 * @returns An array of unique Cloudinary URLs found
 */
export function extractAllCloudinaryUrls(data: any): string[] {
  const urls = new Set<string>();

  if (!data) return [];

  // If it's a string, look for URLs
  if (typeof data === 'string') {
    // Check if the string itself is a cloudinary URL
    if (data.includes('res.cloudinary.com')) {
      urls.add(data);
    }
    // Check for inline URLs (e.g., in HTML content)
    const regex = /https?:\/\/res\.cloudinary\.com\/[^\s"'>]+/g;
    const matches = data.match(regex);
    if (matches) {
      matches.forEach(match => urls.add(match));
    }
    return Array.from(urls);
  }

  // If it's an array, process each item
  if (Array.isArray(data)) {
    data.forEach(item => {
      const itemUrls = extractAllCloudinaryUrls(item);
      itemUrls.forEach(url => urls.add(url));
    });
    return Array.from(urls);
  }

  // If it's an object, process each value
  if (typeof data === 'object' && data !== null) {
    Object.values(data).forEach(value => {
      const valueUrls = extractAllCloudinaryUrls(value);
      valueUrls.forEach(url => urls.add(url));
    });
    return Array.from(urls);
  }

  return Array.from(urls);
}

/**
 * Generic handler for updating a document and automatically removing orphaned Cloudinary images.
 * @param model Mongoose model
 * @param query Query to find the document
 * @param updateData Data to update the document with
 * @returns The updated document, or null if not found
 */
export async function updateDocumentAndCleanImages<T>(
  model: Model<T>,
  query: Record<string, any>,
  updateData: Record<string, any>
) {
  // 1. Fetch the existing document
  const existingDoc = await model.findOne(query).lean();
  if (!existingDoc) return null;

  // 2. Perform the update
  const updatedDoc = await model.findOneAndUpdate(
    query,
    updateData,
    { returnDocument: 'after', runValidators: true }
  );

  if (!updatedDoc) return null;

  // 3. Extract URLs and find differences
  const oldUrls = extractAllCloudinaryUrls(existingDoc);
  
  // We extract URLs from the input `updateData` to detect exactly what changed or is replacing old content.
  // We can also extract from `updatedDoc`. Let's use `updatedDoc` (which has the new state).
  // Need to convert to plain object to ensure getters, etc don't interfere with extraction.
  const updatedDocPlain = typeof updatedDoc.toObject === 'function' ? updatedDoc.toObject() : updatedDoc;
  const newUrls = new Set(extractAllCloudinaryUrls(updatedDocPlain));

  const imagesToDelete: string[] = [];
  oldUrls.forEach(url => {
    if (!newUrls.has(url)) {
      const pid = getPublicIdFromUrl(url);
      if (pid) imagesToDelete.push(pid);
    }
  });

  // 4. Delete orphaned images
  if (imagesToDelete.length > 0) {
    await Promise.all(imagesToDelete.map(pid => deleteImage(pid)));
  }

  return updatedDoc;
}

/**
 * Generic handler for deleting a document and automatically removing its Cloudinary images.
 * @param model Mongoose model
 * @param query Query to find the document
 * @returns The deleted document, or null if not found
 */
export async function deleteDocumentAndCleanImages<T>(
  model: Model<T>,
  query: Record<string, any>
) {
  // 1. Delete the document
  const deletedDoc = await model.findOneAndDelete(query);
  if (!deletedDoc) return null;

  // 2. Extract URLs
  // Convert to plain object if it's a Mongoose document
  const deletedDocPlain = typeof deletedDoc.toObject === 'function' ? deletedDoc.toObject() : deletedDoc;
  const urls = extractAllCloudinaryUrls(deletedDocPlain);

  // 3. Delete images
  const imagesToDelete: string[] = [];
  urls.forEach(url => {
    const pid = getPublicIdFromUrl(url);
    if (pid) imagesToDelete.push(pid);
  });

  if (imagesToDelete.length > 0) {
    await Promise.all(imagesToDelete.map(pid => deleteImage(pid)));
  }

  return deletedDoc;
}
