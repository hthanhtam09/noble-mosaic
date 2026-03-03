import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';
const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || '';

const getCredentials = () => {
  console.log('--- R2 INIT CHK ---');
  console.log('Account ID passed:', R2_ACCOUNT_ID?.substring(0, 5) + '...');
  console.log('Access Key passed:', R2_ACCESS_KEY_ID?.substring(0, 5) + '...');
  console.log('Secret Key passed:', R2_SECRET_ACCESS_KEY ? 'Yes' : 'No');
  console.log('Bucket in SDK:', R2_BUCKET_NAME);
  return {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  };
};

// Create S3 client connected to Cloudflare R2
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: getCredentials(),
  forcePathStyle: true, // Required for Cloudflare R2 API compatibility
});

/**
 * Uploads a file to Cloudflare R2
 * @param file The file to upload
 * @param folder The folder path (prefix) to upload the file to
 * @returns Object containing the public URL and the object key (publicId)
 */
export async function uploadImage(file: File, folder: string = 'noble-mosaic'): Promise<{ url: string; publicId: string }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generate a unique identifier for the file
    const uniqueId = crypto.randomUUID();
    // Try to extract original extension, default to .png if unavailable
    const extension = file.name ? file.name.split('.').pop() : 'png';
    const key = `${folder}/${uniqueId}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type || 'image/png',
    });

    await r2Client.send(command);

    // If R2_PUBLIC_DOMAIN is provided, use it. Otherwise, return a fallback or the key itself.
    // Make sure to remove trailing slashes from the domain.
    let url = `/${key}`;
    if (R2_PUBLIC_DOMAIN) {
      const cleanDomain = R2_PUBLIC_DOMAIN.replace(/\/$/, '');
      url = cleanDomain.startsWith('http') ? `${cleanDomain}/${key}` : `https://${cleanDomain}/${key}`;
    }

    return {
      url,
      publicId: key,
    };
  } catch (error) {
    console.error('Error uploading image to R2:', error);
    throw error;
  }
}

/**
 * Deletes an image from Cloudflare R2 by its public ID (object key)
 * @param publicId The object key to delete
 * @returns Boolean indicating success or failure
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: publicId,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    console.error(`Error deleting image ${publicId} from R2:`, error);
    return false;
  }
}

/**
 * Deletes all objects in a specific folder (prefix) in Cloudflare R2
 * @param folderPath The folder path (prefix) to delete
 * @returns Boolean indicating success or failure
 */
export async function deleteFolder(folderPath: string): Promise<boolean> {
  try {
    // Make sure folderPath ends with a slash so it acts as a directory prefix
    const prefix = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    
    // First, list all objects with this prefix
    const listCommand = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    });
    
    const listResponse = await r2Client.send(listCommand);
    const objects = listResponse.Contents;
    
    if (!objects || objects.length === 0) {
      return true; // Folder is already empty or doesn't exist
    }
    
    // Delete all objects found
    const deletePromises = objects
      .filter(obj => obj.Key)
      .map(obj => deleteImage(obj.Key as string));
      
    await Promise.all(deletePromises);
    
    // Check if there are more objects (pagination)
    if (listResponse.IsTruncated) {
      // Recursively call to delete the rest
      return deleteFolder(folderPath);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting folder ${folderPath} from R2:`, error);
    return false;
  }
}

/**
 * Extracts the R2 object key from a given URL.
 * Example: https://pub-[xxx].r2.dev/noble-mosaic/image.png -> noble-mosaic/image.png
 */
export function getPublicIdFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    // Sanitize any accidentally corrupted URLs (e.g. from the previous bug)
    let sanitizedUrl = url.replace('https://https://', 'https://');

    // If we have a public domain configured, we can extract the key based on that
    if (R2_PUBLIC_DOMAIN) {
      const cleanDomain = R2_PUBLIC_DOMAIN.replace(/\/$/, '');
      const domainUrl = cleanDomain.startsWith('http') ? `${cleanDomain}/` : `https://${cleanDomain}/`;
      
      if (sanitizedUrl.startsWith(domainUrl)) {
        return sanitizedUrl.substring(domainUrl.length);
      }
    }
    
    // Generic fallback: try to parse it as an R2 URL or standard URL and get everything after the domain
    const parsedUrl = new URL(url);
    // Remove the leading slash
    const key = parsedUrl.pathname.substring(1);
    return key || null;
  } catch (error) {
    console.error('Error parsing R2 URL:', error);
    return null;
  }
}

/**
 * Checks if a string is a valid R2 URL for this application.
 */
export function isR2Url(url: string): boolean {
  if (!url) return false;
  if (R2_PUBLIC_DOMAIN) {
    const cleanDomain = R2_PUBLIC_DOMAIN.replace(/\/$/, '');
    return url.includes(cleanDomain);
  }
  // Fallback if no public domain is set
  return url.includes('r2.cloudflarestorage.com') || url.includes('r2.dev') || url.includes('pub-');
}
