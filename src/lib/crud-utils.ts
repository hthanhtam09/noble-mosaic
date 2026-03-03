import mongoose, { Model } from 'mongoose';
import { deleteImage, getPublicIdFromUrl, isR2Url } from '@/lib/r2';

/**
 * Recursively extracts all R2 URLs from an object, array, or string.
 * @param data The data to search (can be a string, array, object, etc.)
 * @returns An array of unique R2 URLs found
 */
export function extractAllR2Urls(data: any): string[] {
  const urls = new Set<string>();

  if (!data) return [];

  // If it's a string, look for URLs
  if (typeof data === 'string') {
    // Check if the string itself is an R2 URL
    if (data.startsWith('http') && isR2Url(data)) {
      urls.add(data);
    }
    // Check for inline URLs (e.g., in HTML content)
    const regex = /https?:\/\/[^\s"'>]+/g;
    const matches = data.match(regex);
    if (matches) {
      matches.filter(match => isR2Url(match)).forEach(match => urls.add(match));
    }
    return Array.from(urls);
  }

  // If it's an array, process each item
  if (Array.isArray(data)) {
    data.forEach(item => {
      const itemUrls = extractAllR2Urls(item);
      itemUrls.forEach(url => urls.add(url));
    });
    return Array.from(urls);
  }

  // If it's an object, process each value
  if (typeof data === 'object' && data !== null) {
    Object.values(data).forEach(value => {
      const valueUrls = extractAllR2Urls(value);
      valueUrls.forEach(url => urls.add(url));
    });
    return Array.from(urls);
  }

  return Array.from(urls);
}

/**
 * Generic handler for updating a document and automatically removing orphaned R2 images.
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
  const oldUrls = extractAllR2Urls(existingDoc);
  
  // We extract URLs from the input `updateData` to detect exactly what changed or is replacing old content.
  // We can also extract from `updatedDoc`. Let's use `updatedDoc` (which has the new state).
  // Need to convert to plain object to ensure getters, etc don't interfere with extraction.
  const updatedDocPlain = typeof updatedDoc.toObject === 'function' ? updatedDoc.toObject() : updatedDoc;
  const newUrls = new Set(extractAllR2Urls(updatedDocPlain));

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
 * Generic handler for deleting a document and automatically removing its R2 images.
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
  const urls = extractAllR2Urls(deletedDocPlain);

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
