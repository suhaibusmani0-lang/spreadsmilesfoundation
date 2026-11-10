import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let url = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');
      const folder = formData.get('folder') || 'spread_smiles';
      const resourceType = formData.get('resource_type') || 'auto';

      if (!file) {
        return NextResponse.json({ message: 'No file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      url = await uploadToCloudinary(buffer, folder, resourceType);
    } else {
      // JSON payload with base64 data
      const { file, folder, resourceType } = await req.json();
      if (!file) {
        return NextResponse.json({ message: 'No file provided' }, { status: 400 });
      }

      url = await uploadToCloudinary(file, folder || 'spread_smiles', resourceType || 'auto');
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: error.message || 'File upload failed' }, { status: 500 });
  }
}
