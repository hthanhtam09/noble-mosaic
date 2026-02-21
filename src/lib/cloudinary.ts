import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadImage(file: File, folder: string = 'noble-mosaic'): Promise<{ url: string; publicId: string }> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            url: result?.secure_url || '',
            publicId: result?.public_id || '',
          });
        }
      }
    ).end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

export async function deleteFolder(folderPath: string): Promise<boolean> {
  try {
    // Delete all resources in the folder (required before deleting the folder)
    await cloudinary.api.delete_resources_by_prefix(folderPath);
    // Delete the now-empty folders (including nested ones like color/ and uncolor/ if they exist)
    // We'll just try to delete the main folder, Cloudinary will error if it's not empty, but let's try
    try {
      await cloudinary.api.delete_folder(`${folderPath}/color`);
    } catch(e) { /* ignore if doesn't exist */ }
    try {
       await cloudinary.api.delete_folder(`${folderPath}/uncolor`);
    } catch(e) { /* ignore if doesn't exist */ }
    try {
      await cloudinary.api.delete_folder(folderPath);
    } catch(e) { /* ignore */ }
    return true;
  } catch (error) {
    console.error(`Error deleting folder ${folderPath}:`, error);
    return false;
  }
}
