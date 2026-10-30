import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id, 10);
    const rooms = await query('SELECT * FROM rooms WHERE id = ? LIMIT 1', [id]);
    if (!rooms || rooms.length === 0) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const room = rooms[0];
    const images = await query('SELECT * FROM room_images WHERE room_id = ? ORDER BY sort_order ASC', [id]);
    
    let parsedFeatures = [];
    try {
      parsedFeatures = typeof room.features === 'string' ? JSON.parse(room.features) : room.features;
    } catch (e) {
      parsedFeatures = [];
    }

    return NextResponse.json({
      ...room,
      features: parsedFeatures || [],
      room_images: images
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch room' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = parseInt(params.id, 10);
    const data = await request.json();

    const {
      name,
      category,
      price,
      show_price,
      price_basis,
      capacity,
      location,
      primary_image,
      features,
      dining_note,
      disclaimer,
      sort_order,
      is_active
    } = data;

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name.trim()); }
    if (category !== undefined) { fields.push('category = ?'); values.push(category); }
    if (price !== undefined) { fields.push('price = ?'); values.push(parseInt(price, 10) || 0); }
    if (show_price !== undefined) { fields.push('show_price = ?'); values.push(show_price ? 1 : 0); }
    if (price_basis !== undefined) { fields.push('price_basis = ?'); values.push(price_basis); }
    if (capacity !== undefined) { fields.push('capacity = ?'); values.push(capacity); }
    if (location !== undefined) { fields.push('location = ?'); values.push(location); }
    if (primary_image !== undefined) { fields.push('primary_image = ?'); values.push(primary_image); }
    if (features !== undefined) {
      const featArray = Array.isArray(features) ? features : [features];
      fields.push('features = ?');
      values.push(JSON.stringify(featArray));
    }
    if (dining_note !== undefined) { fields.push('dining_note = ?'); values.push(dining_note); }
    if (disclaimer !== undefined) { fields.push('disclaimer = ?'); values.push(disclaimer); }
    if (sort_order !== undefined) { fields.push('sort_order = ?'); values.push(parseInt(sort_order, 10) || 0); }
    if (is_active !== undefined) { fields.push('is_active = ?'); values.push(is_active ? 1 : 0); }

    if (fields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' });
    }

    values.push(id);
    await query(`UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`, values);

    return NextResponse.json({ success: true, message: 'Room updated successfully' });
  } catch (err) {
    console.error('Update room error:', err);
    return NextResponse.json({ error: err.message || 'Failed to update room' }, { status: 500 });
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
      const roomRows = await query('SELECT primary_image FROM rooms WHERE id = ?', [id]);
      if (roomRows && roomRows[0]?.primary_image) {
        await deleteFromCloudinary(roomRows[0].primary_image);
      }
      const galleryRows = await query('SELECT image_url FROM room_images WHERE room_id = ?', [id]);
      if (galleryRows && galleryRows.length > 0) {
        for (const row of galleryRows) {
          if (row.image_url) await deleteFromCloudinary(row.image_url);
        }
      }
    } catch (cleanErr) {
      console.warn('Could not clean Cloudinary images for room:', cleanErr);
    }

    // Delete room; foreign key CASCADE will delete room_images
    await query('DELETE FROM rooms WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: 'Room deleted successfully' });
  } catch (err) {
    console.error('Delete room error:', err);
    return NextResponse.json({ error: 'Failed to delete room' }, { status: 500 });
  }
}
