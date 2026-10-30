import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

// Add new image to room gallery
export async function POST(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roomId = parseInt(params.id, 10);
    const { image_url, caption = '', is_primary = false } = await request.json();

    if (!image_url) {
      return NextResponse.json({ error: 'image_url is required' }, { status: 400 });
    }

    if (is_primary) {
      await query('UPDATE room_images SET is_primary = 0 WHERE room_id = ?', [roomId]);
      await query('UPDATE rooms SET primary_image = ? WHERE id = ?', [image_url, roomId]);
    }

    const res = await query(
      `INSERT INTO room_images (room_id, image_url, caption, is_primary, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [roomId, image_url, caption, is_primary ? 1 : 0, 99]
    );

    return NextResponse.json({ success: true, id: res.insertId, message: 'Image added successfully' });
  } catch (err) {
    console.error('Add room image error:', err);
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 });
  }
}

// Delete an image from room gallery
export async function DELETE(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roomId = parseInt(params.id, 10);
    const { searchParams } = new URL(request.url);
    const imageId = parseInt(searchParams.get('imageId'), 10);

    if (!imageId) {
      return NextResponse.json({ error: 'imageId query param is required' }, { status: 400 });
    }

    // Check if the image has a Cloudinary URL to delete it from cloud storage as well
    const rows = await query('SELECT image_url FROM room_images WHERE id = ? AND room_id = ?', [imageId, roomId]);
    if (rows && rows.length > 0 && rows[0].image_url) {
      await deleteFromCloudinary(rows[0].image_url);
    }

    await query('DELETE FROM room_images WHERE id = ? AND room_id = ?', [imageId, roomId]);

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Delete room image error:', err);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}

// Set image as primary
export async function PUT(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const roomId = parseInt(params.id, 10);
    const { imageId, image_url } = await request.json();

    if (!imageId && !image_url) {
      return NextResponse.json({ error: 'imageId or image_url is required' }, { status: 400 });
    }

    await query('UPDATE room_images SET is_primary = 0 WHERE room_id = ?', [roomId]);

    if (imageId) {
      await query('UPDATE room_images SET is_primary = 1 WHERE id = ? AND room_id = ?', [imageId, roomId]);
      const rows = await query('SELECT image_url FROM room_images WHERE id = ?', [imageId]);
      if (rows && rows.length > 0) {
        await query('UPDATE rooms SET primary_image = ? WHERE id = ?', [rows[0].image_url, roomId]);
      }
    } else if (image_url) {
      await query('UPDATE room_images SET is_primary = 1 WHERE image_url = ? AND room_id = ?', [image_url, roomId]);
      await query('UPDATE rooms SET primary_image = ? WHERE id = ?', [image_url, roomId]);
    }

    return NextResponse.json({ success: true, message: 'Primary image updated' });
  } catch (err) {
    console.error('Set primary image error:', err);
    return NextResponse.json({ error: 'Failed to update primary image' }, { status: 500 });
  }
}
