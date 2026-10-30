import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const MIME_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml'
};

export async function GET(request, { params }) {
  try {
    const rawSegments = params?.path || [];
    const segments = Array.isArray(rawSegments) ? rawSegments : [rawSegments];
    
    // Sanitize each path segment to prevent path traversal
    const safeSegments = segments.map(seg => seg.replace(/[^a-zA-Z0-9._-]/g, ''));
    
    const uploadsBaseDir = path.resolve(process.cwd(), 'public', 'uploads');
    const targetPath = path.resolve(uploadsBaseDir, ...safeSegments);

    // Security check: ensure target path is inside uploadsBaseDir
    if (!targetPath.startsWith(uploadsBaseDir)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Check if file exists
    try {
      await fs.access(targetPath);
    } catch {
      return new NextResponse('Image not found', { status: 404 });
    }

    const ext = path.extname(targetPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    const fileBuffer = await fs.readFile(targetPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800'
      }
    });
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

