import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function checkCloudinary() {
  try {
    const slug = '90-s-vibes-book-1'; // Based on the previous script output
    const colorFolder = `secrets/${slug}/color`;
    const uncolorFolder = `secrets/${slug}/uncolor`;

    const colorResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: colorFolder,
      max_results: 500
    });

    const uncolorResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: uncolorFolder,
      max_results: 500
    });

    console.log(`Color Folder: ${colorFolder} - Count: ${colorResources.resources.length}`);
    console.log(`Uncolor Folder: ${uncolorFolder} - Count: ${uncolorResources.resources.length}`);

    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCloudinary();
