import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function PUT(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    const data = await request.json();

    const {
      title,
      badge,
      description,
      duration,
      terrain_tag,
      price_info,
      weather_note,
      primary_image,
      gallery_images,
      sort_order,
      is_active
    } = data;

    const fields = [];
    const values = [];

    if (title !== undefined) { fields.push('title = ?'); values.push(title.trim()); }
    if (badge !== undefined) { fields.push('badge = ?'); values.push(badge); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }
    if (duration !== undefined) { fields.push('duration = ?'); values.push(duration); }
    if (terrain_tag !== undefined) { fields.push('terrain_tag = ?'); values.push(terrain_tag); }
    if (price_info !== undefined) { fields.push('price_info = ?'); values.push(price_info); }
    if (weather_note !== undefined) { fields.push('weather_note = ?'); values.push(weather_note); }
    if (primary_image !== undefined) { fields.push('primary_image = ?'); values.push(primary_image); }
    if (gallery_images !== undefined) {
      fields.push('gallery_images = ?');
      values.push(JSON.stringify(Array.isArray(gallery_images) ? gallery_images : []));
    }
    if (sort_order !== undefined) { fields.push('sort_order = ?'); values.push(parseInt(sort_order, 10) || 0); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active ? 1 : 0); }

    if (fields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' });
    }

    values.push(id);
    await query(`UPDATE jeep_safaris SET ${fields.join(', ')} WHERE id = ?`, values);

    return NextResponse.json({ success: true, message: 'Jeep Safari updated successfully' });
  } catch (err) {
    console.error('Update safari error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update safari' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);

    // Clean up images from Cloudinary if present
    try {
      const rows = await query('SELECT primary_image, gallery_images FROM jeep_safaris WHERE id = ?', [id]);
      if (rows && rows.length > 0) {
        if (rows[0].primary_image) await deleteFromCloudinary(rows[0].primary_image);
        if (rows[0].gallery_images) {
          const list = typeof rows[0].gallery_images === 'string' ? JSON.parse(rows[0].gallery_images) : rows[0].gallery_images;
          if (Array.isArray(list)) {
            for (const img of list) {
              if (img) await deleteFromCloudinary(img);
            }
          }
        }
      }
    } catch (cleanErr) {
      console.warn('Could not clean Cloudinary images for safari:', cleanErr);
    }

    await query('DELETE FROM jeep_safaris WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Jeep Safari deleted successfully' });
  } catch (err) {
    console.error('Delete safari error:', err);
    return NextResponse.json({ error: 'Failed to delete safari' }, { status: 500 });
  }
}
