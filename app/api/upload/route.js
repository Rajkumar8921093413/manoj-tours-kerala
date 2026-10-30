import { NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { isCloudinaryConfigured, uploadToCloudinary } from '@/lib/cloudinary';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized. Admin login required.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') || formData.get('image');
    const folder = (formData.get('folder') || 'rooms').toString().replace(/[^a-z0-9_-]/gi, '');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // If Cloudinary is configured (e.g. Vercel deployment), upload to Cloudinary CDN
    if (isCloudinaryConfigured()) {
      const originalExt = path.extname(file.name || '');
      const safeBaseName = (path.basename(file.name || 'image', originalExt))
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '_')
        .slice(0, 30);
      const publicId = `${safeBaseName}_${Date.now()}`;

      const uploadResult = await uploadToCloudinary(buffer, folder, publicId);

      return NextResponse.json({
        success: true,
        url: uploadResult.url,
        public_id: uploadResult.public_id,
        storage: 'cloudinary'
      });
    }

    // Local filesystem fallback
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const originalExt = path.extname(file.name || '').toLowerCase();
    const ext = validExtensions.includes(originalExt) ? originalExt : '.jpg';

    const timestamp = Date.now();
    const safeBaseName = (path.basename(file.name || 'image', originalExt))
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, '_')
      .slice(0, 30);
    const fileName = `${safeBaseName}_${timestamp}${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${folder}/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      storage: 'local'
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Failed to upload image: ' + (err.message || 'Unknown error') }, { status: 500 });
  }
}
