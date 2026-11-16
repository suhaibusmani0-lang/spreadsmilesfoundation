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
  let buffer;
  let mimeType = 'image/jpeg';

  if (Buffer.isBuffer(file)) {
    buffer = file;
    if (resourceType === 'raw') mimeType = 'application/pdf';
    else if (buffer[0] === 0x89 && buffer[1] === 0x50) mimeType = 'image/png';
    else if (buffer[0] === 0x47 && buffer[1] === 0x49) mimeType = 'image/gif';
    else if (buffer[0] === 0x52 && buffer[1] === 0x49) mimeType = 'image/webp';
    else if (buffer[0] === 0x25 && buffer[1] === 0x50) mimeType = 'application/pdf';
    else mimeType = 'image/jpeg';
  } else if (typeof file === 'string' && file.startsWith('data:')) {
    const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      mimeType = matches[1];
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(file);
    }
  } else if (typeof file === 'string') {
    buffer = Buffer.from(file);
  }

  const base64DataUri = `data:${mimeType};base64,${buffer.toString('base64')}`;

  const hasCloudinaryConfig =
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (hasCloudinaryConfig) {
    try {
      const result = await cloudinary.uploader.upload(base64DataUri, {
        folder,
        resource_type: resourceType,
      });

      if (result && result.secure_url) {
        console.log('✅ Uploaded to Cloudinary successfully:', result.secure_url);
        return result.secure_url;
      }
    } catch (cloudErr) {
      console.warn(
        `⚠️ Cloudinary upload attempt failed (${cloudErr.message}). Using safe inline fallback.`
      );
    }
  }

  // Safe fallback: On serverless/Vercel (read-only filesystem), return base64 Data URI directly
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    console.log('ℹ️ Serverless environment: Returning Base64 Data URI directly.');
    return base64DataUri;
  }

  // On local environment with writable filesystem, save to public/uploads
  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    let extension = 'jpg';
    if (mimeType.includes('pdf')) extension = 'pdf';
    else if (mimeType.includes('png')) extension = 'png';
    else if (mimeType.includes('webp')) extension = 'webp';

    const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (fsErr) {
    console.warn('⚠️ Could not write to disk (read-only), returning base64 Data URI:', fsErr.message);
    return base64DataUri;
  }
}

export default cloudinary;
