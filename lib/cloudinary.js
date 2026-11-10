import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a buffer or base64 string to Cloudinary with safe fallback
 */
export async function uploadToCloudinary(file, folder = 'spread_smiles', resourceType = 'auto') {
  const hasCloudinaryConfig =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinaryConfig) {
    try {
      const cloudinaryUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType,
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result.secure_url);
          }
        );

        if (Buffer.isBuffer(file)) {
          uploadStream.end(file);
        } else if (typeof file === 'string' && file.startsWith('data:')) {
          cloudinary.uploader
            .upload(file, { folder, resource_type: resourceType })
            .then((res) => resolve(res.secure_url))
            .catch(reject);
        } else {
          reject(new Error('Invalid file format'));
        }
      });

      console.log('✅ Uploaded to Cloudinary successfully:', cloudinaryUrl);
      return cloudinaryUrl;
    } catch (cloudErr) {
      console.warn(
        `⚠️ Cloudinary upload attempt failed (${cloudErr.message}). Falling back to local /uploads/ storage.`
      );
    }
  }

  // Safe fallback: save to public/uploads
  return saveToLocalUploads(file, resourceType);
}

/**
 * Fallback to save file to public/uploads
 */
async function saveToLocalUploads(file, resourceType) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  let buffer;
  let extension = resourceType === 'raw' ? 'pdf' : 'jpg';

  if (Buffer.isBuffer(file)) {
    buffer = file;
  } else if (typeof file === 'string' && file.startsWith('data:')) {
    const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mime = matches[1];
      if (mime.includes('pdf')) extension = 'pdf';
      else if (mime.includes('png')) extension = 'png';
      else if (mime.includes('webp')) extension = 'webp';
      else extension = 'jpg';
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(file);
    }
  } else {
    buffer = Buffer.from(file);
  }

  const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
}

export default cloudinary;
